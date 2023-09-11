import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

const Footer = (props) => {
  return (
    <Flex
      align="center"
      justify="center"
      direction="row"
      w="30%"
      color={["gray.700"]}
      {...props}
    >
      <Box>
        <Text fontSize="xs" textAlign="center" opacity="0.6">
          <Box>Questions? Email me at: hello@catacolabs.com</Box>
          <Box>
            &copy; 2022{" "}
            <Text as="u">
              <a href="https://catacolabs.com">CatacoLabs</a>
            </Text>
          </Box>
        </Text>
      </Box>
    </Flex>
  );
};

export default Footer;
