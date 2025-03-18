
import React from 'react';
import { DocumentLayout } from '@/components/layout/DocumentLayout';

const PrivacyPolicy = () => {
  return (
    <DocumentLayout
      title="Privacy Policy"
      description="Learn how PoolChain handles your personal information and protects your privacy."
    >
      <h2>Introduction</h2>
      <p>Effective Date: January 1, {new Date().getFullYear()}</p>
      <p>
        PoolChain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by PoolChain when you use our website, mobile application, and services (collectively, the "Services").
      </p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, update your profile, use the interactive features of our Services, participate in a promotion, or otherwise communicate with us.</p>
      
      <h3>Personal Information</h3>
      <ul>
        <li>Contact Information (name, email address, phone number)</li>
        <li>Profile Information (profile picture, driver's license)</li>
        <li>Payment Information (blockchain wallet address)</li>
        <li>Location Information (pickup and drop-off locations, travel routes)</li>
        <li>Communication Information (messages sent through the platform)</li>
      </ul>

      <h3>Blockchain Information</h3>
      <p>
        As a blockchain-based application, certain information about your transactions on the PoolChain platform is recorded on a public blockchain and is inherently public. This includes:
      </p>
      <ul>
        <li>Wallet addresses</li>
        <li>Transaction amounts</li>
        <li>Transaction timestamps</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our Services</li>
        <li>Process transactions and send related information</li>
        <li>Match riders with drivers</li>
        <li>Verify identity and prevent fraud</li>
        <li>Provide customer support</li>
        <li>Send technical notices, updates, security alerts, and support messages</li>
        <li>Respond to user comments, questions, and requests</li>
      </ul>

      <h2>Data Sharing and Disclosure</h2>
      <p>We may share information about you in the following circumstances:</p>
      <ul>
        <li>With other users as needed to facilitate rides (limited to necessary information)</li>
        <li>With third-party service providers who perform services on our behalf</li>
        <li>In response to legal process or when we believe disclosure is necessary to protect rights and safety</li>
        <li>In connection with a business transfer such as a merger or acquisition</li>
      </ul>

      <h2>User Rights</h2>
      <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
      <ul>
        <li>Access to your personal information</li>
        <li>Correction of inaccurate information</li>
        <li>Deletion of your information (subject to certain exceptions)</li>
        <li>Restriction of processing</li>
        <li>Data portability</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect the security of your personal information. However, no electronic transmission or storage system is guaranteed to be 100% secure, and we cannot ensure or warrant the security of information you transmit to us.
      </p>

      <h2>International Data Transfers</h2>
      <p>
        Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have different data protection laws.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        Our Services are not directed to children under 18. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information of a child under 18, we will delete such information.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date at the top.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:
        <br />
        Email: privacy@poolchain.example.com
      </p>
    </DocumentLayout>
  );
};

export default PrivacyPolicy;
