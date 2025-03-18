
import React from 'react';
import { DocumentLayout } from '@/components/layout/DocumentLayout';

const TermsOfService = () => {
  return (
    <DocumentLayout
      title="Terms of Service"
      description="Please read these terms carefully before using PoolChain's services."
    >
      <h2>Welcome to PoolChain</h2>
      <p>Effective Date: January 1, {new Date().getFullYear()}</p>
      <p>
        These Terms of Service ("Terms") govern your access to and use of PoolChain's website, mobile application, and services (collectively, the "Services"). Please read these Terms carefully before using our Services.
      </p>
      <p>
        By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
      </p>

      <h2>Using PoolChain</h2>
      <h3>Eligibility</h3>
      <p>
        You must be at least 18 years of age to use our Services. By using our Services, you represent and warrant that you meet all eligibility requirements.
      </p>

      <h3>Account Registration</h3>
      <p>
        To use certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
      </p>

      <h3>Digital Wallet</h3>
      <p>
        Our Services require connecting a blockchain wallet to facilitate transactions. You are responsible for maintaining the security of your wallet and private keys. PoolChain is not responsible for any losses resulting from unauthorized access to your wallet.
      </p>

      <h2>User Conduct</h2>
      <p>You agree not to engage in any of the following prohibited activities:</p>
      <ul>
        <li>Violating any applicable laws or regulations</li>
        <li>Impersonating any person or entity</li>
        <li>Harassing, threatening, or intimidating any other user</li>
        <li>Using the Services for any illegal purpose</li>
        <li>Attempting to gain unauthorized access to the Services or related systems</li>
        <li>Using the Services to spam or distribute malware</li>
        <li>Engaging in any activity that disrupts or interferes with the Services</li>
      </ul>

      <h2>Rides and Transactions</h2>
      <p>
        PoolChain facilitates connections between drivers and riders but is not a transportation service provider. Drivers are independent contractors and not employees of PoolChain.
      </p>
      <p>
        All payments and transactions are facilitated through smart contracts on the blockchain. You acknowledge that blockchain transactions are irreversible and PoolChain has no ability to reverse or modify transactions once confirmed on the blockchain.
      </p>

      <h2>User Content</h2>
      <p>
        Users may post content, including reviews, comments, and profile information. You retain ownership of any content you submit, but grant PoolChain a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The Services and all content and materials included on the Services, including logos, designs, text, graphics, and software, are the property of PoolChain or its licensors and are protected by copyright, trademark, and other intellectual property laws.
      </p>

      <h2>Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
      </p>
      <p>
        POOLCHAIN DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        IN NO EVENT SHALL POOLCHAIN BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE SERVICES.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless PoolChain from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.
      </p>

      <h2>Modifications to These Terms</h2>
      <p>
        We may modify these Terms at any time. If we make material changes to these Terms, we will notify you by email or by posting a notice on our website prior to the effective date of the changes.
      </p>

      <h2>Termination</h2>
      <p>
        We may terminate or suspend your access to the Services at any time, without prior notice, for any reason, including if you violate these Terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which PoolChain is established, without regard to its conflict of law principles.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about these Terms, please contact us at:
        <br />
        Email: legal@poolchain.example.com
      </p>
    </DocumentLayout>
  );
};

export default TermsOfService;
