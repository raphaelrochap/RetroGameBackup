import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Button,
  Stack,
  InputLeftElement,
  InputRightAddon,
  Icon,
  Input,
  InputGroup,
  HStack,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Box,
  Switch,
  useBoolean,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { FaGamepad, FaRegFolder } from "react-icons/fa";
import { DrawerExtensionSelector } from "../components/DrawerExtensionSelector";
import { ModalRealizaBackup } from "../components/ModalRealizaBackup";
import { ConfirmationDialog } from "../components/ConfirmationDialog";

export default function HomePage() {
  const listaPadraoJogos = [
    { extension: "bin", checked: false },
    { extension: "cdi", checked: false },    
    { extension: "fs", checked: false },            
    { extension: "gb", checked: false },
    { extension: "gbc", checked: false },
    { extension: "hi", checked: false },
    { extension: "iso", checked: false },
    { extension: "n64", checked: false },
    { extension: "nes", checked: false },
    { extension: "nv", checked: false },    
    { extension: "pbp", checked: false },
    { extension: "pce", checked: false },        
    { extension: "sco", checked: false },    
    { extension: "sfc", checked: false },
    { extension: "smc", checked: false },
    { extension: "xml", checked: false },
    { extension: "zip", checked: false },
  ]

  const listaPadraoSaves = [
    { extension: "auto", checked: false },
    { extension: "cfg", checked: false },
    { extension: "dss", checked: false },
    { extension: "dsv", checked: false },
    { extension: "ppst", checked: false },
    { extension: "rtc", checked: false },
    { extension: "srm", checked: true },
    { extension: "state", checked: true },    
  ]

  const [extensoesJogos, setExtensoesJogos] = useState(listaPadraoJogos);
  const [extensoesSaves, setExtensoesSaves] = useState(listaPadraoSaves);
  const [origemPath, setOrigemPath] = useState("");
  const [destinoPath, setDestinoPath] = useState("");
  const [substituiArquivos, setSubstituiArquivos] = useBoolean(false);  
  const [chkBackupTodos, setChkBackupTodos] = useBoolean(false);
  const [chkBackupJogos, setChkBackupJogos] = useBoolean(false);
  const [chkBackupSaves, setChkBackupSaves] = useBoolean(true);
  const alertBackupDisclosue = useDisclosure();
  const modalBackupDisclosue = useDisclosure();  
  const alertSubstituiDisclosue = useDisclosure();
  const validationFormDisclosue = useDisclosure();

  useEffect(() => {
    const handleFolderPath = (folderPath: any) => {
      if (folderPath[1] == "origem") {
        setOrigemPath(folderPath[0]);
      } else
        setDestinoPath(folderPath[0]);
    }

    window.ipc.on("folderPath", handleFolderPath);
  }, []);

  const handleBackup = async () => {

    const payLoad = {
      origemPath,
      destinoPath,
      substituiArquivos,
      extensoesJogos: chkBackupJogos ? extensoesJogos : [],
      extensoesSaves: chkBackupSaves ? extensoesSaves : [],
      chkBackupTodos
    }

    modalBackupDisclosue.onOpen()
    window.ipc.send('transfer', payLoad)
  };  

  return (
    <React.Fragment>
      <Head>
      <title>RGB - Retro Game Backup</title>
      </Head>
      <Container minHeight="100vh" w="full">
        <VStack w="full" px="75px">
          <DarkModeSwitch />
          <Icon
            mt="10px"
            h="100px"
            w="100px"
            as={FaGamepad}
            color="heroGradientStart"
          />

          <Hero title="Retro Game Backup" />

          <FormControl colorScheme={"purple"}>
            <FormLabel>Diretório de origem:</FormLabel>
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Icon as={FaRegFolder} />
                </InputLeftElement>
                <Input
                  readOnly={true}
                  value={origemPath}
                  placeholder="Insira ou Selecione o diretório..."
                />
                <InputRightAddon
                  as={Button}
                  onClick={() => {
                    window.ipc.send("selectFolder", "origem");
                  }}
                >
                  Selecionar diretório
                </InputRightAddon>
              </InputGroup>
            </Stack>
          </FormControl>

          <FormControl mt={"30px"}>
            <FormLabel>Diretório de destino:</FormLabel>
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Icon as={FaRegFolder} />
                </InputLeftElement>
                <Input
                  readOnly={true}
                  value={destinoPath}
                  placeholder="Insira ou Selecione o diretório..."
                />
                <InputRightAddon
                  as={Button}
                  onClick={() => {
                    window.ipc.send("selectFolder", "destino");
                  }}
                >
                  Selecionar diretório
                </InputRightAddon>
              </InputGroup>
            </Stack>
          </FormControl>

          <FormControl display="flex" alignItems="center" my="30px">
            <FormLabel htmlFor="email-alerts">
              Substituir os arquivos já existentes?
            </FormLabel>
            <Switch
              id="email-alerts"
              size="lg"
              colorScheme={"purple"}
              isChecked={substituiArquivos}
              onChange={() => {
                if (!substituiArquivos) alertSubstituiDisclosue.onOpen();
                setSubstituiArquivos.toggle();
              }}
            />
          </FormControl>

          <Box w="full" h="150px">
            <FormLabel>Extensões para backup:</FormLabel>
            <CheckboxGroup colorScheme={"purple"}>
              <HStack mb="10px">
                <Checkbox
                  isChecked={chkBackupTodos}
                  defaultChecked={chkBackupTodos}
                  onChange={() => {
                    setChkBackupTodos.toggle();
                    setChkBackupJogos.off();
                    setChkBackupSaves.off();
                  }}
                >
                  Fazer backup de TODOS os arquivos
                </Checkbox>
              </HStack>
              <HStack mb="10px" ml="20px">
                <Checkbox
                  isChecked={chkBackupJogos}
                  defaultChecked={chkBackupJogos}
                  isDisabled={chkBackupTodos}
                  onChange={setChkBackupJogos.toggle}
                >
                  Apenas de Jogos com a extensão:
                </Checkbox>
                <DrawerExtensionSelector
                  title="Jogos"
                  disabled={chkBackupTodos || !chkBackupJogos}
                  defaultValue={listaPadraoJogos}
                  value={extensoesJogos}
                  onChange={(value) => {
                    setExtensoesJogos(value);
                  }}
                />
              </HStack>
              <HStack ml="20px">
                <Checkbox
                  isChecked={chkBackupSaves}
                  defaultChecked={chkBackupSaves}
                  isDisabled={chkBackupTodos}
                  onChange={setChkBackupSaves.toggle}
                >
                  Apenas de Saves/States com a extensão:
                </Checkbox>

                <DrawerExtensionSelector
                  title="Saves"
                  disabled={chkBackupTodos || !chkBackupSaves}
                  defaultValue={listaPadraoSaves}
                  value={extensoesSaves}
                  onChange={(value) => {
                    setExtensoesSaves(value);
                  }}
                />
              </HStack>
            </CheckboxGroup>
          </Box>

          <Footer mt="50px">
            <Button
              onClick={() => {
                if (origemPath == '' || destinoPath == '')
                  validationFormDisclosue.onOpen()
                else
                  alertBackupDisclosue.onOpen()
              }}
              variant="solid"
              size={"lg"}
              colorScheme="purple"
            >
              Fazer Backup
            </Button>
          </Footer>
        </VStack>

        <ModalRealizaBackup alertDialogProps={modalBackupDisclosue} />

        <ConfirmationDialog
          title="Você tem certeza?"
          description="Ao marcar essa opção os seu saves/states já existentes serão substituídos pelos já existentes na pasta de destino."
          onYes={() => {}}
          onCancel={setSubstituiArquivos.off}
          alertDialogProps={alertSubstituiDisclosue}          
        />

        <ConfirmationDialog
          title="Você tem certeza?"
          description="Ao prosseguir todos os arquivos serão transferidos para a pasta solicitada."
          onYes={handleBackup}
          onCancel={() => {}}
          alertDialogProps={alertBackupDisclosue}
        />

        <ConfirmationDialog
          title="Atenção!"
          description="É preciso informar o diretório de Origem e Destino."
          onYes={() => {}}
          onCancel={validationFormDisclosue.onClose}
          alertDialogProps={validationFormDisclosue}
          cancelText='OK'
          disableYes
        />
      </Container>
    </React.Fragment>
  );
}
