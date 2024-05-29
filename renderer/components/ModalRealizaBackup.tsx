import {
  Code,
  HStack,
  Button,
  Modal,
  ModalBody,
  Progress,
  Icon,
  UseDisclosureProps,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Box,
  Center,
  FormLabel
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiSolidErrorCircle } from 'react-icons/bi'

interface ModalRealizaBackupProps {
  alertDialogProps: UseDisclosureProps
}

const ModalRealizaBackup = ({ alertDialogProps }: ModalRealizaBackupProps) => {
  const [total, setTotal] = useState(0);
  const [progresso, setProgresso] = useState(0)
  const [fileName, setFileName] = useState('')
  const [logs, setLogs] = useState([])
  const [fim, setFim] = useState(false)

  useEffect(() => {
    const handleLog = (value: object) => setLogs((prevLogs) => [...prevLogs, value])
    const handleFim = () => setFim(true)
    const handleNome = (value: string) => setFileName(value)
    const handleTotal = (value: number) => setTotal(value)
    const handleProgresso = (value: number) => setProgresso(value)

    window.ipc.on('log', handleLog)
    window.ipc.on('fim', handleFim)
    window.ipc.on('nome', handleNome)
    window.ipc.on('total', handleTotal)
    window.ipc.on('progresso', handleProgresso)
  }, [])

  const handleVoltar = () => {
    setLogs([])
    setTotal(0)
    setProgresso(0)
    alertDialogProps.onClose()    
  }

  return (
    <>
      <Modal isOpen={alertDialogProps.isOpen} onClose={alertDialogProps.onClose} closeOnOverlayClick={false} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{fim ? 'Backup finalizado!' : 'Efetuando Backup...'}</ModalHeader>
          <ModalBody>
            <Progress borderRadius={'5px'} colorScheme='green' height='32px' value={(progresso / total) * 100} />
            <Text>{fim ? 'Transferido' : 'Transferindo'} {progresso} de {total}</Text>
            {!fim && <Code>{fileName}</Code>}          
            
            {fim && logs.length> 0 ? (
              <>
              <FormLabel mt='20px' mb='-13px'>Os seguintes arquivos não foram transferidos:</FormLabel>
              <Box mt="20px" maxH={'300px'} overflow={'scroll'}>              
                {logs.map((log, index) => (
                  <HStack key={index} mb={3} >
                    <Icon color={'orange.400'} as={BiSolidErrorCircle} />
                    <Code borderRadius={'5px'} mx='5px'>{log.text}</Code>
                  </HStack>                  
                ))}
              </Box>
              </>
            ) : <FormLabel mt='20px' mb='-13px'>Todos os arquivos foram transferidos com sucesso!</FormLabel>}
          </ModalBody>
          <ModalFooter>
            {fim && <Center><Button onClick={handleVoltar}>Voltar</Button></Center>}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { ModalRealizaBackup }
