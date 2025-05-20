import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useColorModeValue } from "../../components/ui/color-mode";
import Image from "next/image";

const LoginCarouselCard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideDuration = 4000; // 3.5 seconds

  // List of cards
  const cards = [
    <LoginCarouselC1 key="card1" />,
    <LoginCarouselC2 key="card2" />,
    <LoginCarouselC1 key="card3" />,
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cards.length); // Cycle through cards
    }, slideDuration);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [cards.length]);

  return (
    <>
      <Box
        w="full"
        maxW={{ base: "100%", lg: "445px", xl: "540px" }}
        h={"full"}
        mx="auto"
        overflow="hidden" // Hide overflow for sliding effect
        position="relative"
      >
        <Flex
          w={`${cards.length * 100}%`} // Total width for all cards
          h="full"
          transition="transform 0.5s ease-in-out" // Smooth sliding
          transform={`translateX(-${currentSlide * (100 / cards.length)}%)`} // Slide to current card
        >
          {/* Render cards side by side */}
          {cards.map((card, index) => (
            <Box
              key={index}
              w={`${100 / cards.length}%`} // Each card takes equal width
              h="full"
              flexShrink={0} // Prevent shrinking
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {card}
            </Box>
          ))}
        </Flex>
      </Box>

      <Flex justify="center" mt={4}>
        {cards.map((_, index) => (
          <Box
            key={index}
            w="38px"
            h="6px"
            bg={"gray.300"}
            bgGradient={currentSlide === index ? "linear-gradient(to right, #5B42F3, #8C6FF0)" : ""}
            rounded="full"
            mx={1}
            cursor="pointer"
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Flex>
    </>
  );
};



export const LoginCarouselC1 = () => {
  return (
    <Box
      p={"4"}
      mt={5}
      bg={useColorModeValue("whiteAlpha.600", "whiteAlpha.600")}
      w={"full"}
      maxH={"full"}
      rounded={"3xl"}
    >
      <Box
        p={4}
        bg={useColorModeValue("whiteAlpha.600", "whiteAlpha.600")}
        maxH={"full"}
        rounded={"2xl"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
      >
        <Text alignSelf={"start"} fontSize={"5xl"} fontWeight={"extrabold"} className="text-neutrals-300" lineHeight={"1"}>
          Lets Gets You Started
        </Text>
        <Image src={"/auth/login-carousel-1.svg"} width={220} height={30} objectFit="contain" alt="login" />
      </Box>
    </Box>
  );
};

export const LoginCarouselC2 = () => {
  return (
    <Box
      p={"4"}
      mt={5}
      bg={useColorModeValue("whiteAlpha.600", "whiteAlpha.600")}
      w={"full"}
      maxH={"full"}
      rounded={"3xl"}
    >
      <Box
        p={4}
        bg={useColorModeValue("whiteAlpha.600", "whiteAlpha.600")}
        maxH={"full"}
        rounded={"2xl"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
      >
        <Text alignSelf={"start"} fontSize={"5xl"} fontWeight={"extrabold"} className="text-neutrals-300" lineHeight={"1"}>
          Lets Gets You Started
        </Text>
        <Image src={"/auth/login-carousel-2.svg"} width={390} height={30} objectFit="contain" alt="login" />
      </Box>
    </Box>
  );
};


export default LoginCarouselCard;
