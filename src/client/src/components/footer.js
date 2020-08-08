import React from 'react';
import { H4, List } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import {
  FooterSectionsLayout,
  FooterSectionLayout,
  FooterLink,
  FooterLayout,
  LanguageSection,
  LocaleSwitcher,
  LocaleSwitcherDropdown,
  Newsletter,
  Copyright
} from '@deity/falcon-ecommerce-uikit';

export const Sitemap = () => (
  <FooterSectionsLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.customerService" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.trackOrderLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.returnPolicyLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.faqsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.aboutUs" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.aboutUsLink" />
        </FooterLink>
        <FooterLink to="/blog">
          <T id="sitemap.blogLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.jobsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.terms" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.cookiesLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.termsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
  </FooterSectionsLayout>
);

export const Footer = () => (
  <FooterLayout as="footer">
    {/* <Sitemap /> */}
    <Copyright />
  </FooterLayout>
);
