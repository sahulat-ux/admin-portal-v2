import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Icon,
  Input,
  Portal,
  Skeleton,
  Text,
  VStack,
  chakra,
  useDialog,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useColorModeValue } from "../ui/color-mode";

type CardProps = {
  title: string;
  amount: string | number;
  disbursementPercentage?: number;
  icon: IconType;
  bgCard: string;
  colorIcon: string;
  isLoading: boolean;
};

const UserBalanceCard = ({
  title,
  amount,
  icon,
  bgCard,
  colorIcon,
  isLoading,
}: CardProps) => {
  const textColor = useColorModeValue("#030229", "#030229");
  const cardBg = useColorModeValue(bgCard, "bgCard");
  const iconBg = useColorModeValue(`${colorIcon}/15`, `${colorIcon}/10`);
  const iconColor = useColorModeValue(colorIcon, colorIcon);

  // Use Chakra UI's useDialog hook to manage the dialog state
  const dialog = useDialog();

  // Format the amount with commas as thousand separators and two decimal places
  const number = amount ?? 0;  // agar amount undefined ya null ho toh 0 use karo

const formattedAmount =
  isLoading
    ? null
    : parseFloat(String(number)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return (
    <>
      <Box
        boxShadow={"sm"}
        rounded={"xl"}
        p={"4"}
        display={"flex"}
        flexDir={"row"}
        alignItems={"center"}
        gap={"5"}
        bg={cardBg}
        minH={"115px"}
        h={"full"}
      >
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          flexDir={"column"}
          gap={2.5}
          justifyContent={"space-between"}
          alignItems={"center"}
          // w={"full"}
        >
          <chakra.span
            bg={iconBg}
            p={5}
            rounded={"full"}
            w={"fit-content"}
            display={"flex"}
          >
            <Icon as={icon} color={iconColor} boxSize={5} />
          </chakra.span>

          {title === "Available Balance" && (
            <chakra.span
              px={2.5}
              py={0.5}
              rounded={"2xl"}
              bg={iconBg}
              fontSize={"xs"}
              cursor={"pointer"}
              shadow={"md"}
              transition={"all 0.2s ease-in-out"}
              _hover={{ bg: colorIcon, opacity: "0.7", color: "white" }}
              {...dialog.getTriggerProps()}
            >
              Request
            </chakra.span>
          )}
        </Box>

        <VStack align={"start"} gap={1}>
          {isLoading ? (
            <Skeleton h={"30px"} w={"full"}/>
          ) : 
          (
            <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight={"semibold"}
            wordBreak={"break-word"}
            opacity={0.7}
          >
            {title === "Total User" ? formattedAmount : `Rs${formattedAmount}`}
          </Text>
          )}

          <Text opacity={0.7} fontSize={"sm"} color={textColor}>
            {title}
          </Text>
        </VStack>
      </Box>

      {/* Modal for both withdrawal request and setting percentage */}
      <Dialog.RootProvider value={dialog}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                Request Withdrawal &amp; Set Percentage
              </Dialog.Header>

              {/* 1) Withdrawal section */}
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Box>
                    <Text mb={2} fontWeight="bold">
                      Request Withdrawal
                    </Text>
                    <Input
                      placeholder="Enter amount"
                      // value={withdrawalInput}
                      // onChange={handleWithdrawalInputChange}
                      type="text"
                    />
                  </Box>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  mr={3}
                  colorPalette={"blue"}
                  // onClick={handleWithdrawalSubmit}
                  // isDisabled={!withdrawalInput || isSubmittingWithdrawal}
                  // isLoading={isSubmittingWithdrawal}
                  loadingText="Submitting"
                >
                  Submit Withdrawal
                </Button>
              </Dialog.Footer>

              {/* 2) Percentage section */}
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Box>
                    <Text mb={2} fontWeight="bold">
                      On every settlement the set percentage will be
                      automatically added to disbursement balance.
                    </Text>

                    {/* 
              Single input with <datalist> suggestions. 
              The user can pick a suggestion like "5" or type a custom "12.5".
            */}
                    <Input
                      placeholder="Select or type custom %"
                      // value={percentInput}
                      // onChange={handlePercentInputChange}
                      type="text"
                      list="percentSuggestions"
                    />

                    {/* The datalist with suggestions */}
                    <datalist id="percentSuggestions">
                      <option value="10" label="10%" />

                      <option value="20" label="20%" />

                      <option value="30" label="30%" />

                      <option value="40" label="40%" />

                      <option value="50" label="50%" />

                      <option value="60" label="60%" />

                      <option value="70" label="70%" />

                      <option value="80" label="80%" />

                      <option value="90" label="90%" />

                      <option value="100" label="100%" />
                      {/* Add more presets as needed */}
                    </datalist>
                  </Box>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  colorPalette={"blue"}
                  // onClick={handleSetPercentSubmit}
                  // isDisabled={!percentInput || isSubmittingPercent}
                  // isLoading={isSubmittingPercent}
                  loadingText="Submitting"
                >
                  Set Percent
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </>
  );
};

export default UserBalanceCard;
