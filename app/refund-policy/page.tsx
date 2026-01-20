import LegalLayout from "@/components/LegalLayout";

export default function RefundPage() {
  return (
    <LegalLayout title="Return & Refund Policy" date="January 01, 2026">
      <p>We want you to love your Ferixo product. If you are not entirely satisfied with your purchase, we're here to help.</p>
      
      <h3>1. Returns</h3>
      <p>You have <strong>7 calendar days</strong> to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. It must be in the original packaging.</p>

      <h3>2. Refunds</h3>
      <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment within 5-7 business days.</p>

      <h3>3. Damaged Items</h3>
      <p>If you received a damaged product, please notify us immediately for assistance. We will arrange a free replacement upon verification.</p>
      
      <div className="bg-[#133159] p-6 rounded-xl border border-white/10 mt-8">
        <strong>Contact for Returns:</strong><br />
        <span className="text-blue-400">info@ferixo.com</span>
      </div>
    </LegalLayout>
  );
}