import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Skeleton,
  FormLabel,
  FormControl
} from "@chakra-ui/react";

export default function Hero({
  title,
  subtitle,
  image,
  ctaLink,
  ctaText,
  ...rest
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModal, setModal] = useState(false);
  const [isResult, setResult] = useState(false);
  const [descriptionText, setDescriptionText] = useState(""); //Remove text at EOP
  const [desGPTText, setDesGPTText] = useState("");
  const [requestText, setRequestText] = useState("");
  const [resultText, setResultText] = useState("");
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  

  //Functions that update the state with their respective textboxes
  let handleDescriptionChange = (e) => {
    let inputValue = e.target.value
    setDescriptionText(inputValue)
  }

  let handleRequestChange = (e) => {
    let inputValue = e.target.value
    setRequestText(inputValue)
  }

  //Custom open/close modals to set and reset the results shown
  const openModal = () => {
    console.log("opening modal and getting GPT3 description for app");
    //Get description before opening modal
    getDescription();
    console.log("Open Modal:");
    console.log(desGPTText);
    setModal(true);
    onOpen();
  }

  const closeModal = () => {
    console.log("closing modal and resetting modal variables");
    //Hide result textarea
    setRequestText('');
    setResult(false);
    onClose();
  }

  const getDescription= () => {
    console.log("Attempt to get GPT3 description of tool");
    console.log(descriptionText);
    let tempText = descriptionText || "Turn plain english into bash commands"
    fetch("https://api.openai.com/v1/completions", {
      body: '{\n  "model": "text-davinci-002",\n  "prompt": "Given text, return a 1 sentence description for a tool. Text:'+tempText+'. Description: A tool that",\n  "max_tokens": 64,\n  "temperature": 0\n}',
      headers: {
        Authorization: "Bearer "+API_KEY,
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(res => res.json())
    .then(res => res.choices[0].text)
    .then(res => setDesGPTText(res))
  }

  const getResult = () => {
    console.log("Attempt to get GPT3 result of request");
    console.log(requestText);
    fetch("https://api.openai.com/v1/completions", {
      body: '{\n  "model": "text-davinci-002",\n  "prompt": "Given text, return 1 response as a tool that '+desGPTText+'. Text:'+requestText+'. Response:",\n  "max_tokens": 64,\n  "temperature": 0\n}',
      headers: {
        Authorization: "Bearer "+API_KEY,
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(res => res.json())
    .then(res => res.choices[0].text)
    .then(res => setResultText(res))
    .then(res => setResult(true))
  }

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        spacing={4}
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="blue.600"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="blue.600"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Input
          value={descriptionText}
          onChange={handleDescriptionChange}
          placeholder='Turn plain english into bash commands' 
          />
        <Button onClick={() => {
          setTimeout(() => {
            setModal(false);
          }, 3000);
          openModal();
        }}
          isLoading={isModal}
          colorScheme="blue"
          borderRadius="8px"
          py="4"
          px="4"
          lineHeight="1"
          size="md"
        >
          {ctaText}
        </Button>
        <Text
          fontSize="xs"
          mt={2}
          textAlign="center"
          color="blue.600"
          opacity="0.6"
          as='i'
        >
          No credit card required... yet
        </Text>
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        {/* TODO: Make this change every X secs */}
        <Image src={image} size="100%" rounded="1rem" shadow="2xl" />
      </Box>
      <>
        <Modal onClose={closeModal} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>GPT-3 Tool</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <div>
                <FormLabel>Description:</FormLabel>
                A tool that - {desGPTText}
              </div>
              <FormControl>
                <FormLabel>Command:</FormLabel>
                <Textarea
                  value={requestText}
                  onChange={handleRequestChange}
                  placeholder='Enter your request here' 
                  />
              </FormControl>
              <Skeleton isLoaded={isResult}>
                <Text noOfLines={10}>
                  {resultText}
                </Text>
              </Skeleton>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={getResult}>
                Try It
              </Button>
              <Button onClick={closeModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Flex>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string
};

Hero.defaultProps = {
  title: "React landing page with Chakra UI",
  subtitle:
    "This is the subheader section where you describe the basic benefits of your product",
  image: "https://unsplash.com/collections/856079/800x600", //"https://source.unsplash.com/collection/404339/800x600",
  ctaText: "Create your account now",
  ctaLink: "/create"
};