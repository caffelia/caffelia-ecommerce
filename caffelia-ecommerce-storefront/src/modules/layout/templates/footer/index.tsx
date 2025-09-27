import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import Facebook from "@modules/common/icons/facebook"
import Instagram from "@modules/common/icons/instagram"
import Twitter from "@modules/common/icons/twitter"
import MapPin from "@modules/common/icons/map-pin"
import Phone from "@modules/common/icons/phone"
import Mail from "@modules/common/icons/mail"
import MercadoPagoMethods from "@modules/common/icons/mercadopago-methods"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-20">
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-primary-500 hover:text-ui-fg-base uppercase"
            >
              Caffelia
            </LocalizedClientLink>
            <p className="text-sm max-w-xs">
              Disfruta del auténtico café de especialidad de Colombia. Descubre
              sabores únicos en cada taza.
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
                Empresa
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Carrera
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base font-semibold">
                Ayuda
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href="/customer-support"
                    className="hover:text-ui-fg-base"
                  >
                    Atención al cliente
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/delivery-details"
                    className="hover:text-ui-fg-base"
                  >
                    Detalles de envío
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/terms-and-conditions"
                    className="hover:text-ui-fg-base"
                  >
                    Términos y Condiciones
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/privacy-policy"
                    className="hover:text-ui-fg-base"
                  >
                    Política de Privacidad
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base font-semibold">
                Contacto
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li className="flex items-center gap-x-2">
                  <MapPin size={16} />
                  <span>Carrera 1 # 26 - 31, Cartago, Colombia</span>
                </li>
                <li className="flex items-center gap-x-2">
                  <Phone size={16} />
                  <span>+57 311 524 4162</span>
                </li>
                <li className="flex items-center gap-x-2">
                  <Mail size={16} />
                  <a
                    href="mailto:admin@caffelia.co"
                    className="hover:text-ui-fg-base"
                  >
                    admin@caffelia.co
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Caffelia. Todos los derechos
            reservados.
          </Text>
          <div className="flex items-center gap-x-2">
            <div className="flex gap-x-2">
              <MercadoPagoMethods size="40" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
