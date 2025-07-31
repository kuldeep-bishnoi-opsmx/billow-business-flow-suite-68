import React from 'react';
import { Card } from '@/components/ui/card';

export interface InvoiceFormatData {
  id: string;
  name: string;
  description: string;
  layout: 'classic' | 'modern' | 'minimal' | 'professional' | 'corporate' | 'creative' | 'elegant' | 'compact' | 'detailed' | 'bold';
}

export const INVOICE_FORMATS: InvoiceFormatData[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional layout with clean lines and professional styling',
    layout: 'classic'
  },
  {
    id: 'modern',
    name: 'Modern Business',
    description: 'Contemporary design with emphasis on branding',
    layout: 'modern'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, clean design with lots of white space',
    layout: 'minimal'
  },
  {
    id: 'professional',
    name: 'Professional Corporate',
    description: 'Formal business layout suitable for enterprises',
    layout: 'professional'
  },
  {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Executive-level formatting with sophisticated styling',
    layout: 'corporate'
  },
  {
    id: 'creative',
    name: 'Creative Design',
    description: 'Eye-catching design for creative businesses',
    layout: 'creative'
  },
  {
    id: 'elegant',
    name: 'Elegant Premium',
    description: 'Luxurious styling for premium services',
    layout: 'elegant'
  },
  {
    id: 'compact',
    name: 'Compact Summary',
    description: 'Space-efficient layout for detailed invoices',
    layout: 'compact'
  },
  {
    id: 'detailed',
    name: 'Detailed Comprehensive',
    description: 'Comprehensive layout with all details visible',
    layout: 'detailed'
  },
  {
    id: 'bold',
    name: 'Bold Statement',
    description: 'Strong visual impact with bold typography',
    layout: 'bold'
  }
];

interface InvoicePreviewProps {
  format: InvoiceFormatData;
  isSelected?: boolean;
  onClick?: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ format, isSelected, onClick }) => {
  const getFormatStyles = () => {
    switch (format.layout) {
      case 'classic':
        return 'border-2 border-gray-300 bg-white p-4';
      case 'modern':
        return 'border border-primary bg-gradient-to-br from-primary/5 to-secondary/5 p-4';
      case 'minimal':
        return 'border border-gray-200 bg-white p-6';
      case 'professional':
        return 'border-2 border-blue-600 bg-blue-50 p-4';
      case 'corporate':
        return 'border border-gray-700 bg-gray-50 p-4';
      case 'creative':
        return 'border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 p-4';
      case 'elegant':
        return 'border border-gold bg-gradient-to-b from-amber-50 to-yellow-50 p-4';
      case 'compact':
        return 'border border-green-400 bg-green-50 p-3';
      case 'detailed':
        return 'border-2 border-orange-400 bg-orange-50 p-5';
      case 'bold':
        return 'border-4 border-red-500 bg-red-50 p-4';
      default:
        return 'border border-gray-300 bg-white p-4';
    }
  };

  const getHeaderStyle = () => {
    switch (format.layout) {
      case 'modern':
        return 'text-lg font-bold text-primary mb-2';
      case 'minimal':
        return 'text-xl font-light text-gray-600 mb-3';
      case 'bold':
        return 'text-2xl font-black text-red-600 mb-2';
      case 'elegant':
        return 'text-lg font-serif text-amber-800 mb-2';
      default:
        return 'text-lg font-semibold text-gray-800 mb-2';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="font-semibold mb-2">{format.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{format.description}</p>
        
        {/* Mini Invoice Preview */}
        <div className={`rounded-md ${getFormatStyles()} text-xs`}>
          <div className={getHeaderStyle()}>INVOICE</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="font-medium">Your Business</div>
              <div className="text-gray-600">123 Business St</div>
            </div>
            <div className="text-right">
              <div>INV-001</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="border-t pt-2 mb-2">
            <div className="font-medium mb-1">Bill To:</div>
            <div>Customer Name</div>
          </div>
          <div className="border-t pt-2">
            <div className="grid grid-cols-3 gap-1 font-medium mb-1">
              <div>Item</div>
              <div>Qty</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div>Service</div>
              <div>1</div>
              <div className="text-right">₹1,000</div>
            </div>
            <div className="border-t mt-1 pt-1 text-right font-medium">
              Total: ₹1,000
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface InvoiceFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (formatId: string) => void;
}

export const InvoiceFormatSelector: React.FC<InvoiceFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Invoice Format</h3>
        <p className="text-sm text-muted-foreground">
          Select the invoice format that best represents your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INVOICE_FORMATS.map((format) => (
          <InvoicePreview
            key={format.id}
            format={format}
            isSelected={selectedFormat === format.id}
            onClick={() => onFormatChange(format.id)}
          />
        ))}
      </div>
    </div>
  );
};