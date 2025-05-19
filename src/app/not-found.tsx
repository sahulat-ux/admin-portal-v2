"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  const textColor = useColorModeValue("#03022980", "#03022980");

  return (
    <Box
      w={"full"}
      minH={"100vh"}
      display={"flex"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
      color={textColor}
    >
      <h2>Oops!</h2>
      <p>404 page not found</p>
      {/* <Image src={"/not-found.svg"} width={150} height={150} alt="not-found" /> */}
      <Link href="/">
        <Button variant={"outline"} mt={1}>Return to Home</Button>
      </Link>
    </Box>
  );
}
