import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";

export function getInterfaceID(contractInterface: Interface) {
  let interfaceID: BigNumber = ethers.constants.Zero;
  const functions: string[] = Object.keys(contractInterface.functions);
  for (let i = 0; i < functions.length; i++)
    interfaceID = interfaceID.xor(contractInterface.getSighash(functions[i]));

  return interfaceID;
}
