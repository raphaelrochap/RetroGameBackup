import { Flex, Heading } from '@chakra-ui/react'

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
  >
    <Heading fontSize="4xl">{title}</Heading>
  </Flex>
)

Hero.default = {
  title: 'with-typescript-chakra-ui',
}
