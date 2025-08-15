import { Heading, Text, Button } from "@medusajs/ui";
import Image from "next/image"; 

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { ArrowUpRightMini } from "@medusajs/icons";

const EmptyCartMessage = () => {
  return (
    <div className="py-12 bg-gray-50 rounded-lg shadow-sm">
      <div className="content-container flex flex-col justify-center items-center text-center">
        <Image
          src="/images/empty-cart.jpg" 
          alt="Carrito vacío"
          width={200}
          height={200}
          className="mb-6"
        />
        <Heading
          level="h1"
          className="text-3xl font-semibold text-primary-900 mb-2"
        >
          Tu carrito está vacío
        </Heading>
        <Text className="text-md text-neutral-dark-600 mb-6 max-w-sm">
          Parece que aún no has añadido nada a tu carrito. ¡Empieza a explorar nuestros productos!
        </Text>
        <div>
          <LocalizedClientLink href="/store" passHref>
            <Button className="bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200 h-12 px-6 flex items-center gap-x-2">
              <span>Ir a la tienda</span>
              <ArrowUpRightMini />
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
