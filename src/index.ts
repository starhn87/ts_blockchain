import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index: number,
    prevHash: string,
    timestamp: number,
    data: string
  ): string => CryptoJS.SHA256(index + prevHash + timestamp + data).toString();

  static validateStructure = (block: Block): boolean =>
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.prevHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string";

  public index: number;
  public hash: string;
  public prevHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    prevHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "234232342", "", "Hi", 12345);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const prevBlock: Block = getLatestBlock();
  const newIndex: number = prevBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    prevBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    prevBlock.hash,
    data,
    newTimestamp
  );

  addBlock(newBlock);

  return newBlock;
};

const getHashforBlock = (block: Block): string =>
  Block.calculateBlockHash(
    block.index,
    block.prevHash,
    block.timestamp,
    block.data
  );

const isBlockValid = (candidateBlock: Block, prevBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (prevBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (prevBlock.hash !== candidateBlock.prevHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
