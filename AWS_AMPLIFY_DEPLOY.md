# AWS Amplify deployment

This project is a static React site; it does not require an AWS backend. The
Amplify build also includes the Estrada promo page used by the homepage hero.

## Option 1: Connect the source repository

1. Push this project to a Git provider supported by Amplify.
2. In the AWS Amplify console, choose **Create new app** and connect the
   repository and production branch.
3. Add the environment variable
   `AMPLIFY_MONOREPO_APP_ROOT=artifacts/estrada-landscaping`.
4. Keep the repository's `amplify.yml` build settings. They build both the
   website and its promo page, then publish the combined static output.
5. After the first build, open **Hosting → Rewrites and redirects** and add:
   - Source: `/<*>`
   - Target: `/index.html`
   - Status: `200 (Rewrite)`
6. To use a custom domain, open **Hosting → Custom domains** and connect the
   domain. Amplify provisions a managed SSL certificate; domain registration
   and any DNS-provider charges are separate.

## Option 2: Upload the prepared ZIP

The generated manual-deploy bundle is:

`generated-artifacts/aws-amplify/estrada-landscaping-amplify.zip`

In Amplify, choose **Create new app → Deploy without Git**, select **Drag and
drop**, and upload that ZIP. It contains the contents of the static build
folder at its root. Then add the same SPA rewrite from step 5 above.

To rebuild the manual package after changing the site:

```sh
bash scripts/build-amplify-site.sh
cd generated-artifacts/aws-amplify/site
zip -qr ../estrada-landscaping-amplify.zip .
```

## Rough monthly hosting comparison

Checked against the published pricing pages on October 28, 2026. These are
hosting estimates only, before taxes and domain registration/renewal.

For a simple comparison, assume **1,000 page visits/month** and about **1 MB
transferred per visit** (about 1 GB total):

| Hosting option | Approx. monthly hosting cost |
| --- | ---: |
| Replit Static Deployment | About **$0.05** for 1 GiB transferred; static hosting itself is free |
| AWS Amplify, outside free allowances | About **$0.18**: roughly $0.15 for 1 GB served, $0.03 for a 3-minute build, and less than $0.01 for storing this site's build |

At that traffic level, **Replit is usually cheaper after AWS free allowances**.
If the AWS account is eligible for the current Amplify free-tier allowance,
the example's transfer, storage, and build usage may be covered. AWS currently
lists up to 15 GB served, 5 GB stored, and 1,000 build minutes at no cost for
eligible accounts; account-specific Free Tier or credit terms apply.

The site has approximately **32.6 MB of local gallery photos**. If all 1,000
visits downloaded every gallery photo, transfer would be about 32.6 GB/month:
roughly **$4.89 on Amplify** versus **$1.60 on Replit Static** outside free
allowances. The gallery lazy-loads images, so visitors who do not browse the
whole gallery will use less bandwidth. The homepage's Pexels videos and
Unsplash photos are hosted by those providers and are not included in these
site-host bandwidth estimates.

Static hosting is billed by data transferred, not by each individual file
request. If “1,000 hits” means 1,000 HTTP requests rather than 1,000 visits,
the actual file sizes transferred determine the cost. This is a static site,
so AWS's separate SSR request charges do not apply.

Custom-domain registration is separate on both platforms. Replit says it adds
no domain-purchase surcharge beyond the registrar's registration and renewal
prices. Amplify's managed SSL certificate is included. If you use Route 53 for
DNS, its first 25 public hosted zones cost $0.50/month each; you can keep your
current DNS provider instead.

## Pricing references

- [AWS Amplify pricing](https://aws.amazon.com/amplify/pricing/)
- [AWS Amplify monorepo configuration](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html)
- [AWS Amplify SPA rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)
- [AWS Amplify manual deployment](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html)
- [Amazon Route 53 pricing](https://aws.amazon.com/route53/pricing/)
- [Replit publishing costs](https://docs.replit.com/billing/deployment-pricing)
- [Replit domain purchasing](https://docs.replit.com/build/domain-purchasing)
