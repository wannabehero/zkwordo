import { HStack, Image, Link } from '@chakra-ui/react';

import github from '../assets/github.png';
import polygon from '../assets/polygon.svg';
import { ZKWORDO_CONTRACT } from '../web3/const';

const Footer = () => (
  <HStack py="16px" spacing="12px" justifyContent="center">
    <Link target="_blank" href={`https://mumbai.polygonscan.com/address/${ZKWORDO_CONTRACT}`}>
      <Image src={polygon} alt="Polygon" boxSize="30px" />
    </Link>
    <Link target="_blank" href="https://github.com/wannabehero/zkwordo">
      <Image src={github} alt="Github" boxSize="30px" />
    </Link>
  </HStack>
);

export default Footer;
