"use client";

import UserBalanceCard from "@/components/cards/UserBalanceCard";
import { Box, Grid, GridItem, Heading, HStack, Text } from "@chakra-ui/react";
import { BiCollection, BiDollar, BiSolidCollection } from "react-icons/bi";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { SiOpencollective } from "react-icons/si";

function Page() {

  return (
    <Box
      p={6}
      display={"flex"}
      flexDir={"column"}
      gap={6}
    >
      <HStack align={"center"} justify={"space-between"}>
        <Heading fontSize={"2xl"}>Dashboard</Heading>

        <Text>10-8-2000</Text>
      </HStack>

      <Grid
        gridTemplateColumns={{
          base: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr",
          xl: "repeat(4, 1fr)",
        }}
        gap={{ base: "4", md: "6" }}
      >
        <GridItem>
          <UserBalanceCard
            title="Today Collection"
            amount={"15500"}
            icon={BiCollection}
            bgCard="white"
            bgIcon="#605BFF"
            colorIcon="#605BFF"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Collection"
            amount={"15500"}
            icon={BiCollection}
            bgCard="white"
            bgIcon="#FFC327"
            colorIcon="#B85EFF"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Balance to Disbursement"
            amount={"15500"}
            icon={BiCollection}
            bgCard="white"
            bgIcon="#FF8F6B"
            colorIcon="#FF8F6B"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Disbursement Amount"
            amount={"15500"}
            icon={BiCollection}
            bgCard="white"
            bgIcon="#5B93FF"
            colorIcon="#FF6A77"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Available Balance"
            amount={"15500"}
            icon={BiSolidCollection}
            bgCard="white"
            bgIcon="#FF6A77"
            colorIcon="#FF8F6B"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Settlement Amount"
            amount={"15500"}
            icon={SiOpencollective}
            bgCard="white"
            bgIcon="#26C0E2"
            colorIcon="#26C0E2"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="USDT Settlement"
            amount={"15500"}
            icon={BiDollar}
            bgCard="white"
            bgIcon="#B85EFF"
            colorIcon="#00C4B4"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Remaining Settlement"
            amount={"15500"}
            icon={BiCollection}
            bgCard="white"
            bgIcon="#00C4B4"
            colorIcon="#3B8CFF"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Refund"
            amount={"15500"}
            icon={RiRefund2Line}
            bgCard="white"
            bgIcon="#6A38DB"
            colorIcon="#FFC327"
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total User"
            amount={"15500"}
            icon={MdOutlinePeopleAlt}
            bgCard="white"
            bgIcon="#FFA726"
            colorIcon="#FFA726"
          />
        </GridItem>

      </Grid>
    </Box>
  );
}

export default Page;
