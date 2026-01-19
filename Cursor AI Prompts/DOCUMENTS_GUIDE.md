# 📄 DOCUMENT MANAGEMENT - STYLE GUIDE
**Hyperion Tech Hub | Quotes, Purchase Orders & Invoices Design System**

---

## 📋 SYSTEM OVERVIEW

The document management system generates professional Quotes, Purchase Orders, and Invoices with specific formatting requirements:
- Document numbers: PREFIX-DDMMYYYY-XXXX format
- Continuing from PO-2025-0003 and HTH-2025-0003
- Net 14 days payment terms
- Full editing capabilities for Admins and Super Admins only
- Role-based view permissions

---

## 🎨 DOCUMENT TYPES

```
1. Quote (HTH)           - Quotations for services
2. Purchase Order (PO)   - Purchase order documents
3. Invoice (INV)         - Payment invoices
```

---

## 🏗️ DOCUMENTS LIST PAGE

```jsx
<div className="space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl text-[#1B1C1E] mb-2">Documents</h1>
      <p className="text-gray-600">
        Manage quotes, purchase orders, and invoices
      </p>
    </div>
    
    {/* Action Buttons (Admin/Super Admin Only) */}
    {(role === 'admin' || role === 'superadmin') && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white">
            <Plus className="mr-2 w-4 h-4" />
            Create Document
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate('/documents/create/quote')}>
            <FileText className="mr-2 w-4 h-4" />
            New Quote
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/documents/create/po')}>
            <FileText className="mr-2 w-4 h-4" />
            New Purchase Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/documents/create/invoice')}>
            <Receipt className="mr-2 w-4 h-4" />
            New Invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </div>
  
  {/* Filter Tabs */}
  <Tabs defaultValue="all" className="w-full">
    <TabsList className="bg-gray-100">
      <TabsTrigger value="all">All Documents</TabsTrigger>
      <TabsTrigger value="quote">Quotes</TabsTrigger>
      <TabsTrigger value="po">Purchase Orders</TabsTrigger>
      <TabsTrigger value="invoice">Invoices</TabsTrigger>
    </TabsList>
    
    <TabsContent value="all" className="mt-6">
      {/* Documents Table */}
    </TabsContent>
  </Tabs>
  
  {/* Documents Table */}
  <Card className="border-none shadow-lg">
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Document Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-[#1A2BC2]">
                {doc.documentNumber}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getTypeBadgeColor(doc.type)}>
                  {doc.type.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">{doc.clientName}</TableCell>
              <TableCell className="text-gray-600">{doc.date}</TableCell>
              <TableCell className="font-medium text-[#1B1C1E]">
                ₦{doc.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(doc.status)}>
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/documents/view/${doc.id}`)}>
                      <Eye className="mr-2 w-4 h-4" />
                      View
                    </DropdownMenuItem>
                    {(role === 'admin' || role === 'superadmin') && (
                      <>
                        <DropdownMenuItem onClick={() => navigate(`/documents/edit/${doc.id}`)}>
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 w-4 h-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>
```

### Badge Color Functions:
```jsx
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'quote':
      return 'border-blue-200 text-blue-700 bg-blue-50';
    case 'po':
      return 'border-purple-200 text-purple-700 bg-purple-50';
    case 'invoice':
      return 'border-green-200 text-green-700 bg-green-50';
    default:
      return 'border-gray-200 text-gray-700 bg-gray-50';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Paid':
    case 'Approved':
      return 'bg-green-50 text-green-700 border-none';
    case 'Pending':
      return 'bg-orange-50 text-orange-700 border-none';
    case 'Draft':
      return 'bg-gray-100 text-gray-700 border-none';
    case 'Overdue':
      return 'bg-red-50 text-red-700 border-none';
    default:
      return 'bg-gray-100 text-gray-700 border-none';
  }
};
```

---

## 📝 DOCUMENT VIEW PAGE

```jsx
<div className="max-w-5xl mx-auto space-y-6">
  {/* Header Actions */}
  <div className="flex items-center justify-between">
    <Button 
      variant="ghost" 
      onClick={() => navigate('/documents')}
      className="hover:text-[#1A2BC2]"
    >
      <ArrowLeft className="mr-2 w-4 h-4" />
      Back to Documents
    </Button>
    
    <div className="flex items-center space-x-2">
      <Button variant="outline" className="border-gray-300">
        <Download className="mr-2 w-4 h-4" />
        Download PDF
      </Button>
      <Button variant="outline" className="border-gray-300">
        <Printer className="mr-2 w-4 h-4" />
        Print
      </Button>
      {(role === 'admin' || role === 'superadmin') && (
        <Button 
          className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white"
          onClick={() => navigate(`/documents/edit/${documentId}`)}
        >
          <Edit className="mr-2 w-4 h-4" />
          Edit
        </Button>
      )}
    </div>
  </div>
  
  {/* Document Card */}
  <Card className="border-none shadow-xl">
    <CardContent className="p-12">
      {/* Document Content */}
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-8 border-b-2 border-gray-200">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#1A2BC2] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h2 className="text-2xl text-[#1B1C1E] font-semibold">
                  Hyperion Tech Hub
                </h2>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Plot 624, No. 9 Clifford Omozeghian Ave.</p>
              <p>Gbazango Extension II, Arab Road</p>
              <p>Kubwa, FCT-Abuja</p>
              <p className="mt-2">Phone: +234 906 4951 938</p>
              <p>Email: info@hyperiontechhub.com</p>
              <p>Website: www.hyperiontechhub.com</p>
            </div>
          </div>
          
          {/* Document Info */}
          <div className="text-right">
            <Badge 
              className={`mb-4 text-sm px-4 py-1 ${getTypeBadgeColor(document.type)}`}
            >
              {document.type.toUpperCase()}
            </Badge>
            <h1 className="text-3xl text-[#1B1C1E] mb-2">
              {document.type === 'quote' ? 'QUOTATION' : 
               document.type === 'po' ? 'PURCHASE ORDER' : 'INVOICE'}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="text-lg font-semibold text-[#1A2BC2]">
                {document.documentNumber}
              </p>
              <p>Date: {document.date}</p>
              {document.type === 'invoice' && (
                <p>Due Date: {document.dueDate}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Client Info */}
        <div>
          <h3 className="text-sm text-gray-500 mb-2">
            {document.type === 'po' ? 'VENDOR' : 'BILL TO'}
          </h3>
          <div className="text-[#1B1C1E]">
            <p className="font-semibold text-lg">{document.clientName}</p>
            <p className="text-gray-600 mt-1">{document.clientAddress}</p>
            <p className="text-gray-600">{document.clientEmail}</p>
            <p className="text-gray-600">{document.clientPhone}</p>
          </div>
        </div>
        
        {/* Items Table */}
        <div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {document.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-gray-600">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-[#1B1C1E]">{item.description}</div>
                      {item.details && (
                        <div className="text-sm text-gray-500 mt-1">{item.details}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">₦{item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₦{(item.quantity * item.unitPrice).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₦{document.subtotal.toLocaleString()}</span>
            </div>
            {document.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount ({document.discountPercent}%):</span>
                <span>-₦{document.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>VAT (7.5%):</span>
              <span>₦{document.vat.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-2 flex justify-between text-xl font-semibold text-[#1B1C1E]">
              <span>Total:</span>
              <span className="text-[#1A2BC2]">₦{document.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Terms */}
        {document.type === 'invoice' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-[#1B1C1E] mb-3">
              PAYMENT TERMS
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Payment Due:</strong> Net 14 days from invoice date</p>
              <p><strong>Bank Details:</strong></p>
              <p className="ml-4">Bank Name: Example Bank</p>
              <p className="ml-4">Account Name: Hyperion Tech Hub</p>
              <p className="ml-4">Account Number: 1234567890</p>
            </div>
          </div>
        )}
        
        {/* Notes */}
        {document.notes && (
          <div>
            <h3 className="text-sm font-semibold text-[#1B1C1E] mb-2">
              NOTES
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {document.notes}
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            For questions, contact us at info@hyperiontechhub.com or +234 906 4951 938
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

---

## ✏️ DOCUMENT CREATE/EDIT FORM

```jsx
<div className="max-w-5xl mx-auto space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl text-[#1B1C1E] mb-2">
        {isEdit ? 'Edit' : 'Create'} {documentType === 'quote' ? 'Quote' : 
         documentType === 'po' ? 'Purchase Order' : 'Invoice'}
      </h1>
      <p className="text-gray-600">
        Fill in the details below to generate a professional document
      </p>
    </div>
  </div>
  
  <form onSubmit={handleSubmit} className="space-y-6">
    <Card className="border-none shadow-lg">
      <CardContent className="p-8">
        {/* Document Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm text-[#1B1C1E] font-medium">
              Document Number
            </label>
            <Input
              value={documentNumber}
              disabled
              className="bg-gray-50 border-gray-300"
            />
            <p className="text-xs text-gray-500">
              Auto-generated: {getPrefix()}-DDMMYYYY-XXXX
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[#1B1C1E] font-medium">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
              required
            />
          </div>
        </div>
        
        {/* Client Information */}
        <div className="mb-8">
          <h3 className="text-lg text-[#1B1C1E] mb-4 font-semibold">
            {documentType === 'po' ? 'Vendor' : 'Client'} Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#1B1C1E] font-medium">
                Name
              </label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#1B1C1E] font-medium">
                Email
              </label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#1B1C1E] font-medium">
                Phone
              </label>
              <Input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#1B1C1E] font-medium">
                Address
              </label>
              <Textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        {/* Line Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#1B1C1E] font-semibold">
              Line Items
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              className="border-[#1A2BC2] text-[#1A2BC2] hover:bg-[#1A2BC2] hover:text-white"
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-sm text-[#1B1C1E] font-medium">
                        Description
                      </label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="border-gray-300"
                        placeholder="Item description"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm text-[#1B1C1E] font-medium">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="border-gray-300"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm text-[#1B1C1E] font-medium">
                        Unit Price
                      </label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        className="border-gray-300"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm text-[#1B1C1E] font-medium">
                        Amount
                      </label>
                      <Input
                        value={`₦${(item.quantity * item.unitPrice).toLocaleString()}`}
                        disabled
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>
                    
                    <div className="md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Totals Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">₦{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (7.5%):</span>
                <span className="font-medium">₦{calculateVAT().toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-xl font-semibold">
                <span className="text-[#1B1C1E]">Total:</span>
                <span className="text-[#1A2BC2]">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="mt-8 space-y-2">
          <label className="text-sm text-[#1B1C1E] font-medium">
            Notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]"
            rows={4}
            placeholder="Additional notes or terms..."
          />
        </div>
      </CardContent>
    </Card>
    
    {/* Action Buttons */}
    <div className="flex items-center justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/documents')}
        className="border-gray-300"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-[#1A2BC2] hover:bg-[#0D0D52] text-white"
      >
        <Save className="mr-2 w-4 h-4" />
        {isEdit ? 'Update' : 'Create'} Document
      </Button>
    </div>
  </form>
</div>
```

---

## 🔢 DOCUMENT NUMBER GENERATION

```typescript
// Document number format: PREFIX-DDMMYYYY-XXXX
const generateDocumentNumber = (type: 'quote' | 'po' | 'invoice', lastNumber: string) => {
  const prefix = type === 'quote' ? 'HTH' : type === 'po' ? 'PO' : 'INV';
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  
  // Extract serial from last number or start from 0001
  const lastSerial = lastNumber ? parseInt(lastNumber.split('-')[2]) : 0;
  const newSerial = String(lastSerial + 1).padStart(4, '0');
  
  return `${prefix}-${day}${month}${year}-${newSerial}`;
};

// Example outputs:
// HTH-09012026-0004
// PO-09012026-0004
// INV-09012026-0001
```

---

## ✅ DOCUMENT MANAGEMENT CHECKLIST

When building document system:

- [ ] Implement document number auto-generation
- [ ] Create role-based access control (Admin/Super Admin edit)
- [ ] Add document type filtering tabs
- [ ] Include status badges with colors
- [ ] Show proper currency formatting (₦)
- [ ] Calculate VAT automatically (7.5%)
- [ ] Add line item management (add/remove)
- [ ] Include payment terms (Net 14 days)
- [ ] Add download PDF functionality
- [ ] Include print functionality
- [ ] Show company branding/logo
- [ ] Add notes/terms section
- [ ] Implement proper calculations
- [ ] Create professional document layout
- [ ] Add action dropdowns with permissions

---

## 🚀 CURSOR AI PROMPT

```
Create a document management system for Hyperion Tech Hub using the Documents Style Guide.

Include:
1. Documents List Page:
   - Filter tabs (All, Quotes, PO, Invoices)
   - Data table with document number, type, client, date, amount, status
   - Color-coded type badges (blue/purple/green)
   - Status badges (green for paid, orange for pending, red for overdue)
   - Action dropdown (View, Edit, Download, Delete)
   - Create button with dropdown (Admin/Super Admin only)

2. Document View Page:
   - Professional layout with company header
   - Document number format: PREFIX-DDMMYYYY-XXXX
   - Client/vendor information
   - Line items table with descriptions, quantities, prices
   - Subtotal, VAT (7.5%), total calculations
   - Payment terms (Net 14 days for invoices)
   - Notes section
   - Action buttons (Download PDF, Print, Edit)

3. Create/Edit Form:
   - Auto-generated document number
   - Client information fields
   - Dynamic line items (add/remove)
   - Real-time total calculations
   - Notes textarea
   - Save/Cancel buttons

Use brand colors #1A2BC2 and #0D0D52.
Restrict editing to Admin/Super Admin roles only.
All users can view based on role permissions.
```

---

**Last Updated:** January 2026
**Version:** 1.0
**Page Type:** Document Management
