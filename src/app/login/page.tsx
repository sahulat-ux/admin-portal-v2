"use client";

// pages/login.tsx

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  Icon,
  Field,
  Spinner,
} from "@chakra-ui/react";
import { FaLock, FaEnvelope, FaEye, FaEyeLowVision } from "react-icons/fa6";
import { useEffect, useState } from "react";
import LoginCarouselCard from "./LoginCarouselCard";
import {
  useColorModeValue,
} from "../../components/ui/color-mode";
import { jwtVerify } from "jose";
import { loginCall } from "@/utils/apisHandler";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formBackground = useColorModeValue("#FFFFFF", "#FFFFFF");
  const textColor = useColorModeValue("gray.800", "gray.800");
  const inputBackground = useColorModeValue("#F7F7F8", "#F7F7F8");
  const buttonBackground = useColorModeValue("#4c71ff", "#4c71ff");
  const iconColor = useColorModeValue("gray.500", "gray.500");
  const logoColor = useColorModeValue(
    "/sahulatpay-logo-light.svg",
    "/sahulatpay-logo-light.svg"
  );

  const validateFields = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const decodeJwtToken = async (token: any) => {
    const SECRET_KEY = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY
    );
    try {
      const { payload: verifyPayload } = await jwtVerify(token, SECRET_KEY);
      return verifyPayload;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      const response = await loginCall(email, password);
      const token = response.data.token;
      const encodedToken = await decodeJwtToken(token);

      if (response.success) {
        if (encodedToken?.role === "Admin") {
          router.push("/");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      {/* Animated Box */}
      <Box
        position="relative"
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={0} // Ensure it's behind the login content
      >
        <Flex
          w={"full"}
          h={"full"}
          position={"absolute"}
          inset={"0"}
          zIndex={"-2"}
        >
          <Box
            // bg={useColorModeValue("#4c71ff", "blue.700")}
            bgGradient="linear-gradient(to right, #5B42F3, #8C6FF0)"
            flexBasis={"50%"}
            flex={"1"}
          />

          <Box
            bg={useColorModeValue("#e4ebf5", "#e4ebf5")}
            flexBasis={"50%"}
            display={{ base: "none", lg: "block" }}
          />
        </Flex>

        {/* Main Login Container */}
        <Container
          maxW="8xl"
          bg={useColorModeValue("whiteAlpha.800", "whiteAlpha.800")}
          rounded={"3xl"}
          p={4}
          mx={4}
          h="90vh"
          zIndex={1}
        >
          <Flex
            justify="space-between"
            align="center"
            h="full"
            position="relative"
            p={8}
            px={{ base: "0", md: "4" }}
          >
            {/* Logo */}
            <Box
              position="absolute"
              top={{ base: "0", md: "2", lg: "6" }}
              right={{ base: "-1", md: "4" }}
              left={{ base: "-1", md: "4" }}
              zIndex={2}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={4}
              w={"90%"}
              mx={"auto"}
            >
              {/* Sahulat Logo */}
              <Box>
                <Image
                  src={logoColor}
                  alt="Logo"
                  width={{ base: "130px", sm: "180px", md: "220px" }}
                  objectFit="contain"
                />
              </Box>
            </Box>

            {/* Left Side: Illustration */}
            <Box
              flexBasis={"50%"}
              display={{ base: "none", lg: "flex" }}
              flexDir={"column"}
              justifyContent={"start"}
              h={"full"}
              w={"full"}
              position="relative"
              rounded={"2xl"}
              zIndex={2} // Ensure it's above the animated box
            >
              <LoginCarouselCard />
            </Box>

            {/* Right Side: Login Form */}
            <Box
              maxW={{ base: "100%", lg: "490px", xl: "lg" }}
              w="full"
              mx={"auto"}
              pl={{ base: "0", lg: "8" }}
              mt={{ base: "4", md: "0" }}
            >
              <Box
                flexBasis={"50%"}
                flex={"1"}
                bg={formBackground}
                color={textColor}
                p={{ base: "6", md: "8" }}
                borderRadius="lg"
                boxShadow="sm"
                shadowColor={"white"}
                maxW="lg"
                w="full"
                mx={"auto"}
                mb={{ base: 8, lg: 0 }}
                zIndex={2} // Ensure it's above the animated box
              >
                {/* Form Header */}
                <Flex direction="column" align="center" mb={8}>
                  {/* <Icon as={FaLock} w={16} h={16} color={buttonBackground} /> */}
                  <Heading size="4xl" fontWeight="bold">
                    Secured
                  </Heading>
                  <Text
                    color={useColorModeValue("gray.500", "gray.500")}
                    mt={2}
                    fontWeight={"semibold"}
                  >
                    Login into your account
                  </Text>
                </Flex>

                {/* Display Error */}
                {error && (
                  <Text color="red.500" mb={4}>
                    {error}
                  </Text>
                )}

                {/* Form Inputs */}
                <VStack
                  gap={5}
                  as="form"
                  w={"full"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Field.Root id="email" required>
                    <Field.Label fontSize={"md"}>
                      Email address <Field.RequiredIndicator />
                    </Field.Label>
                    <Flex
                      w={"full"}
                      align="center"
                      borderWidth={1}
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focusWithin={{
                        borderColor: buttonBackground,
                        borderWidth: 2,
                      }}
                      p={2}
                      py={0}
                      bg={inputBackground}
                    >
                      <Box
                        p={1}
                        borderRadius="md"
                        mr={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaEnvelope} color={iconColor} />
                      </Box>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        border="none"
                        placeholder="Enter your email"
                        outline="none"
                        px={2}
                        bg="transparent"
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"md"}
                        _placeholder={{ fontSize: "sm" }}
                      />
                    </Flex>
                  </Field.Root>

                  <Field.Root id="password" required>
                    <Field.Label fontSize={"md"}>
                      Password <Field.RequiredIndicator />
                    </Field.Label>
                    <Flex
                      w={"full"}
                      align="center"
                      borderWidth={1}
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focusWithin={{
                        borderColor: buttonBackground,
                        borderWidth: 2,
                      }}
                      p={2}
                      py={0}
                      bg={inputBackground}
                    >
                      <Box
                        p={1}
                        borderRadius="md"
                        mr={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaLock} color={iconColor} />
                      </Box>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        border="none"
                        placeholder="Enter your password"
                        outline="none"
                        px={2}
                        bg="transparent"
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"md"}
                        _placeholder={{ fontSize: "sm" }}
                      />
                      <Box
                        p={1}
                        borderRadius="md"
                        ml={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => setShowPassword(!showPassword)}
                        cursor="pointer"
                      >
                        <Icon
                          as={showPassword ? FaEye : FaEyeLowVision}
                          color={iconColor}
                        />
                      </Box>
                    </Flex>
                  </Field.Root>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    bgGradient="linear-gradient(to right, #5B42F3, #8C6FF0)"
                    color={"white"}
                    w={"full"}
                    fontWeight={"bold"}
                    fontSize={"md"}
                    rounded={"md"}
                    transition={"all 0.25s"}
                    _hover={{ opacity: 0.8 }}
                  >
                    {isLoading && <Spinner />} Login
                  </Button>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
