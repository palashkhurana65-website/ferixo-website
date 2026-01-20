import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" date="January 15, 2026">
      <p>Welcome to Ferixo. By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
      
      <h3>1. Use License</h3>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on Ferixo's website for personal, non-commercial transitory viewing only.</p>
      
      <h3>2. Disclaimer</h3>
      <p>The materials on Ferixo's website are provided on an 'as is' basis. Ferixo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties of merchantability.</p>

      <h3>3. Pricing & Payments</h3>
      <p>All prices listed are inclusive of GST unless stated otherwise. We reserve the right to change pricing at any time without prior notice. Payments are processed securely via Razorpay.</p>
    </LegalLayout>
  );
}