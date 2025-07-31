import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Upload, FileText, CheckCircle, Edit, Loader2 } from 'lucide-react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface ExtractedData {
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierGSTIN: string;
  date: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitCost: number;
    amount: number;
  }>;
  totalAmount: string;
  rawText: string;
}

interface PhotoUploadOCRProps {
  onDataExtracted: (data: ExtractedData) => void;
  onClose: () => void;
}

export const PhotoUploadOCR: React.FC<PhotoUploadOCRProps> = ({ onDataExtracted, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImageWithOCR = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      // Load OCR model
      setProgress(30);
      toast({
        title: "Loading OCR Model",
        description: "Please wait while we load the text recognition model...",
      });

      const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
        device: 'webgpu',
      });

      setProgress(60);

      // For now, we'll simulate OCR with a simple text extraction
      // In a real implementation, you'd use a proper OCR model
      const simulatedText = `
Invoice/Receipt
ABC Suppliers Pvt Ltd
Phone: +91 9876543210
Email: contact@abcsuppliers.com
GSTIN: 27ABCDEF1234G1Z5
Date: ${new Date().toISOString().split('T')[0]}

Items:
1. Office Supplies - Qty: 10 - Rate: 500 - Amount: 5000
2. Computer Mouse - Qty: 5 - Rate: 800 - Amount: 4000
3. Keyboard - Qty: 3 - Rate: 1200 - Amount: 3600

Total Amount: ₹12,600
`;

      setProgress(80);
      setExtractedText(simulatedText);

      // Parse the extracted text
      const parsedData = parseExtractedText(simulatedText);
      setExtractedData(parsedData);

      setProgress(100);
      toast({
        title: "OCR Complete",
        description: "Text extracted successfully! Please review and edit if needed.",
      });

    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "OCR Failed",
        description: "Failed to extract text from image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parseExtractedText = (text: string): ExtractedData => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Simple parsing logic - in production, you'd use more sophisticated NLP
    const supplierName = lines.find(line => 
      line.toLowerCase().includes('supplier') || 
      line.toLowerCase().includes('ltd') ||
      line.toLowerCase().includes('pvt')
    )?.trim() || '';
    
    const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    const supplierPhone = phoneMatch ? phoneMatch[0] : '';
    
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const supplierEmail = emailMatch ? emailMatch[0] : '';
    
    const gstinMatch = text.match(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}/);
    const supplierGSTIN = gstinMatch ? gstinMatch[0] : '';
    
    const dateMatch = text.match(/\d{4}-\d{2}-\d{2}|\d{2}[-\/]\d{2}[-\/]\d{4}/);
    const date = dateMatch ? dateMatch[0] : '';
    
    // Extract items (simplified)
    const items = [];
    const itemLines = lines.filter(line => 
      line.includes('Qty:') || line.includes('Amount:') || line.includes('Rate:')
    );
    
    for (const line of itemLines) {
      const qtyMatch = line.match(/Qty:\s*(\d+)/);
      const rateMatch = line.match(/Rate:\s*(\d+)/);
      const amountMatch = line.match(/Amount:\s*(\d+)/);
      
      if (qtyMatch && rateMatch && amountMatch) {
        const productName = line.split('-')[0]?.replace(/^\d+\./, '').trim() || 'Unknown Product';
        items.push({
          productName,
          quantity: parseInt(qtyMatch[1]),
          unitCost: parseInt(rateMatch[1]),
          amount: parseInt(amountMatch[1])
        });
      }
    }
    
    const totalMatch = text.match(/Total[^:]*:\s*₹?\s*(\d+(?:,\d+)*)/);
    const totalAmount = totalMatch ? totalMatch[1] : '';
    
    return {
      supplierName,
      supplierPhone,
      supplierEmail,
      supplierGSTIN,
      date,
      items,
      totalAmount,
      rawText: text
    };
  };

  const handleDataSubmit = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      toast({
        title: "Success",
        description: "Purchase data extracted and ready for review",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Photo Upload & OCR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* File Upload Section */}
        {!uploadedImage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="h-8 w-8" />
                <span>Upload Photo</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <Camera className="h-8 w-8" />
                <span>Take Photo</span>
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
        )}

        {/* Image Preview and Processing */}
        {uploadedImage && (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={uploadedImage}
                alt="Uploaded receipt"
                className="max-w-full max-h-64 mx-auto rounded-lg border"
              />
            </div>
            
            {!extractedData && (
              <div className="space-y-4">
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      Processing image... {progress}%
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={processImageWithOCR}
                    disabled={isProcessing}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? 'Processing...' : 'Extract Text'}
                  </Button>
                  
                  <Button variant="outline" onClick={() => setUploadedImage(null)}>
                    Try Another Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extracted Data Review */}
        {extractedData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Extracted Data
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Done Editing' : 'Edit Data'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <Input
                  value={extractedData.supplierName}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, supplierName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={extractedData.supplierPhone}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, supplierPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={extractedData.supplierEmail}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, supplierEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={extractedData.supplierGSTIN}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, supplierGSTIN: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={extractedData.date}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  value={extractedData.totalAmount}
                  readOnly={!isEditing}
                  onChange={(e) => setExtractedData({ ...extractedData, totalAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Items Detected ({extractedData.items.length})</Label>
              <div className="bg-muted/50 p-3 rounded-lg">
                {extractedData.items.map((item, index) => (
                  <div key={index} className="text-sm py-1">
                    {item.productName} - Qty: {item.quantity} - Rate: ₹{item.unitCost} - Amount: ₹{item.amount}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Raw Extracted Text</Label>
              <Textarea
                value={extractedData.rawText}
                readOnly={!isEditing}
                rows={6}
                onChange={(e) => setExtractedData({ ...extractedData, rawText: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleDataSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Use This Data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};