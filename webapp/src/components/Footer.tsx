import { HStack, Image, Link } from '@chakra-ui/react';

import base from '../assets/base.png';
import github from '../assets/github.png';
import { ZKWORDO_CONTRACT } from '../web3/const';

const Footer = () => (
  <HStack py="16px" spacing="12px" justifyContent="center">
    <Link target="_blank" href={`https://basescan.org/address/${ZKWORDO_CONTRACT}`}>
      <Image src={base} alt="Base" boxSize="30px" />
    </Link>
    <Link target="_blank" href="https://github.com/wannabehero/zkwordo">
      <Image src={github} alt="Github" boxSize="30px" />
    </Link>
  </HStack>
);

export default Footer;
