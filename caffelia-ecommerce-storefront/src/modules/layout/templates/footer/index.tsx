import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import Facebook from "@modules/common/icons/facebook"
import Instagram from "@modules/common/icons/instagram"
import Twitter from "@modules/common/icons/twitter"
import MapPin from "@modules/common/icons/map-pin"
import Phone from "@modules/common/icons/phone"
import Mail from "@modules/common/icons/mail"
import Visa from "@modules/common/icons/visa"
import Mastercard from "@modules/common/icons/mastercard"
import AmericanExpress from "@modules/common/icons/american-express"
import DinersClub from "@modules/common/icons/diners-club"
import Codensa from "@modules/common/icons/codensa"
import PSE from "@modules/common/icons/pse"
import Efecty from "@modules/common/icons/efecty"

export default async function Footer() {
  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-20">
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-[#d57a44] hover:text-ui-fg-base uppercase"
            >
              Caffelia
            </LocalizedClientLink>
            <p className="text-sm max-w-xs">
              We have clothes that suits your style and which you&apos;re proud
              to wear. From coffee accessories to lifestyle products.
            </p>
            <div className="flex gap-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-ui-fg-subtle hover:text-ui-fg-base"
              >
                <Facebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-ui-fg-subtle hover:text-ui-fg-base"
              >
                <Instagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-ui-fg-subtle hover:text-ui-fg-base"
              >
                <Twitter />
              </a>
            </div>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-3 sm:grid-cols-3">
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base font-semibold">
                Company
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Career
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base font-semibold">
                Help
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Customer Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Delivery Details
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base font-semibold">
                Contact
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li className="flex items-center gap-x-2">
                  <MapPin size={16} />
                  <span>123 Coffee Street, Bean City, BC 12345</span>
                </li>
                <li className="flex items-center gap-x-2">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-x-2">
                  <Mail size={16} />
                  <a
                    href="mailto:hello@caffelia.com"
                    className="hover:text-ui-fg-base"
                  >
                    hello@caffelia.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Caffelia. All rights reserved.
          </Text>
          <div className="flex items-center gap-x-2">
            <span className="txt-compact-small">We accept:</span>
            <div className="flex gap-x-2">
              <Visa />
              <Mastercard />
              <AmericanExpress />
              <DinersClub />
              <Codensa />
              <PSE />
              <Efecty />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
