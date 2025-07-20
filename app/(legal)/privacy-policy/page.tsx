import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | tweakcn",
  description: "Privacy Policy for tweakcn.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 lg:max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8 text-sm">Last Updated: 24 Apr 2025</p>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p className="text-muted-foreground">
          We value your privacy and are committed to safeguarding your personal data. This privacy
          policy explains how we collect, use, and protect your information when you use our
          website, as well as your privacy rights and how they are protected by law.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">2. Data Collection</h2>
        <p className="text-muted-foreground">
          When you use our website, we collect and process the following types of data:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Web Analytics:</strong> Anonymous user data is collecting using PostHog.
          </li>
          <li>
            <strong>Authentication Data:</strong> When you sign up, we collect necessary information
            such as your email address.
          </li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">3. Sharing and Transferring Your Data</h2>
        <p className="text-muted-foreground">
          We do not sell, lease, or trade your personal information. However, we may share your data
          with trusted third parties like to process payments or provide other services on our
          behalf. We ensure that all third-party providers we work with adhere to data protection
          standards, in compliance with relevant laws such as the Information Technology Act 2000
          and Digital Personal Data Protection Act 2023 under Indian law or any other applicable
          laws.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p className="text-muted-foreground">
          We have implemented suitable technical and organizational measures as per the level of
          risk to protect your personal data from unauthorized access, loss, or misuse.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">5. Data Protection</h2>
        <p className="text-muted-foreground">
          You have the following rights concerning your personal data:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Access:</strong> You have the right to request a copy of the personal data we
            hold about you.
          </li>
          <li>
            <strong>Correction:</strong> If any of your data is incorrect or incomplete, you can
            request to have it updated.
          </li>
          <li>
            <strong>Erasure:</strong> You can request that we delete your personal data, subject to
            applicable legal exceptions.
          </li>
          <li>
            <strong>Objection:</strong> You can object to the processing of your personal data for
            certain purposes.
          </li>
          <li>
            <strong>Restriction:</strong> You can ask us to restrict the use of your data under
            certain conditions.
          </li>
          <li>
            <strong>Data Portability:</strong> You have the right to transfer your personal data to
            another service provider, if applicable.
          </li>
          <li>
            <strong>Withdrawal of Consent:</strong> You can withdraw your consent to process your
            personal data at any time.
          </li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">6. Cookies</h2>
        <p className="text-muted-foreground">
          Our website uses essential cookies necessary for user authentication and session
          management. These cookies help maintain your login status and ensure secure access to your
          account. We do not use cookies for tracking or advertising purposes.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">7. Modifications to This Privacy Policy</h2>
        <p className="text-muted-foreground">
          We may update this privacy policy occasionally. Any changes will be posted here, and the
          effective date will be updated at this page. It shall be assumed that you are aware of any
          changes and accept the same.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions or concerns about this privacy policy, please reach out at{" "}
          <a href="mailto:sahaj@tweakcn.com" className="text-primary hover:underline">
            sahaj@tweakcn.com
          </a>
        </p>
      </section>

      <p className="text-muted-foreground mt-12 text-sm">
        By continuing to use this website, you confirm that you have read and understood this
        Privacy Policy.
      </p>
    </div>
  );
}
