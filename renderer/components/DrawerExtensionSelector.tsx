import {
  Box,
  Button,
  Text,
  Icon,
  Input,
  useColorModeValue,
  HStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  SimpleGrid,
  Center,
  DrawerFooter,
  useBoolean,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoAddSharp } from "react-icons/io5";

type ExtensionSelector = {
  extension: string;
  checked: boolean;
};

interface DrawerExtensionSelectorProps {
  title: string;
  disabled: boolean;
  defaultValue: ExtensionSelector[];
  value: ExtensionSelector[];
  onChange: any;
}

const DrawerExtensionSelector = ({
  title,
  disabled,
  defaultValue,
  value,
  onChange,
}: DrawerExtensionSelectorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = useColorModeValue("purple.600", "purple.200");
  const fontColor = useColorModeValue("white", "black");
  const [todos, setTodos] = useBoolean(true);
  const [add, setAdd] = useBoolean(true);
  const [newExtension, setNewExtension] = useState("");
  const inputt = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value.filter((v) => v.checked).length === value.length) setTodos.off();
    else if (value.filter((v) => !v.checked).length === value.length)
      setTodos.on();
  }, [value]);

  const handleAddExtension = () => {
    if (newExtension != "") {
      onChange([
        ...value,
        { extension: newExtension.replaceAll(".", ""), checked: true },
      ]);
      setNewExtension("");
      setAdd.toggle();
    }
  };

  useEffect(() => {
    if (add == false) inputt.current.focus();
  }, [add]);

  return (
    <>
      <Button
        isDisabled={disabled}
        variant={"link"}
        colorScheme="purple"
        onClick={onOpen}
      >
        Escolher extensões
      </Button>
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen} size={"sm"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Extensão de {title}
          </DrawerHeader>
          <Text mx="25px" my="10px">
            Selecione as extensões que você quer fazer backup:
          </Text>
          <Button
            variant={"link"}
            mx="25px"
            colorScheme={"purple"}
            onClick={() => {
              onChange(
                value.map((v) => {
                  return { ...v, checked: todos };
                })
              );
              setTodos.toggle();
            }}
          >
            {todos ? "Marcar" : "Desmarcar"} todos
          </Button>
          <DrawerBody>
            <SimpleGrid columns={3} spacing={3}>
              {value.map((extensionValue, index) => {
                return (
                  <Center
                    key={index}
                    onClick={() => {
                      onChange(
                        value.map((v) =>
                          v === extensionValue
                            ? { ...v, checked: !v.checked }
                            : v
                        )
                      );
                    }}
                    bg={extensionValue.checked ? color : ""}
                    color={extensionValue.checked ? fontColor : ""}
                    _hover={
                      extensionValue.checked
                        ? { bgColor: "purple.300" }
                        : { borderColor: "gray.400" }
                    }
                    userSelect={"none"}
                    borderWidth={"2px"}
                    borderRadius={"8px"}
                    borderColor={extensionValue.checked ? color : ""}
                    minH="40px"
                    wordBreak={"break-word"}
                    cursor="pointer"
                  >
                    {`.${extensionValue.extension}`}
                  </Center>
                );
              })}
            </SimpleGrid>
            <Divider my="10px" />
            {add ? (
              <Box>
                <Center
                  onClick={setAdd.toggle}
                  _hover={{ borderColor: "gray.400" }}
                  borderWidth={"2px"}
                  borderRadius={"8px"}
                  height="40px"
                  cursor="pointer"
                >
                  <Icon as={IoAddSharp} />
                </Center>
              </Box>
            ) : (
              <HStack w="full">
                <Input
                  ref={inputt}
                  value={newExtension}
                  onChange={(e) => {
                    setNewExtension(e.target.value);
                  }}
                />
                <Button onClick={handleAddExtension}>
                  <Icon as={IoAddSharp} />
                </Button>
              </HStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant={"link"}
              mx="25px"
              colorScheme={"purple"}
              onClick={() => {
                onChange(defaultValue);
              }}
            >
              Restaurar extensões padrões
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { DrawerExtensionSelector };
