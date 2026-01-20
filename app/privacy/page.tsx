import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" date="January 10, 2026">
      <p>Your privacy is important to us. It is Ferixo's policy to respect your privacy regarding any information we may collect from you across our website.</p>
      
      <h3>1. Information We Collect</h3>
      <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Name and Contact Details (for shipping)</li>
        <li>Payment Information (processed securely by Razorpay)</li>
        <li>Device and Browser Data (for analytics)</li>
      </ul>

      <h3>2. How We Use Your Data</h3>
      <p>We use your data to process orders, improve our store functionality, and communicate updates regarding your purchase. We <strong>never</strong> sell your data to third parties.</p>

      <h3>3. Security</h3>
      <p>We value your trust in providing us your Personal Information, thus we use commercially acceptable means of protecting it.</p>
    </LegalLayout>
  );
}