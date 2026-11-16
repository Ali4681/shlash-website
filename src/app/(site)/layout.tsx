import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRail } from "@/components/layout/ScrollRail";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import {
  getCmsCompany,
  getCmsContact,
  getCmsNav,
  getCmsSite,
} from "@/lib/cms/content";
import { company as fallbackCompany } from "@/data/company";
import { contactSettings as fallbackContact } from "@/data/contact";
import { nav as fallbackNav, site as fallbackSite } from "@/data/site";

/** CMS-backed chrome must read Postgres on each request. */
export const instant = false;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [company, site, navRows, contact] = await Promise.all([
    getCmsCompany(),
    getCmsSite(),
    getCmsNav(),
    getCmsContact(),
  ]);

  const siteData = site ?? fallbackSite;
  const companyData = company ?? fallbackCompany;
  const navSource: { href: string; label: string }[] =
    navRows.length > 0 ? navRows : fallbackNav;
  const nav = navSource.map((n) => ({
    href: n.href,
    label: n.label,
  }));
  const contactData = contact ?? fallbackContact;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.hash&&location.hash!=='#top'){history.replaceState(null,'',location.pathname+location.search)}window.scrollTo(0,0)}catch(e){}`,
        }}
      />
      <SmoothScroll>
        <div className="site-shell flex min-h-full flex-col">
          <Header site={siteData} nav={nav} contact={contactData} />
          <main className="flex-1">{children}</main>
          <Footer
            site={siteData}
            company={companyData}
            nav={nav}
            contact={contactData}
          />
        </div>
        <ScrollRail />
      </SmoothScroll>
    </>
  );
}
