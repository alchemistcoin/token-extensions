import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721 mint burns ERC20 token", function () {
  it("Calling mint on ERC721 should burn ERC20 token", async function () {
    // given
    const { user, erc20Contract, nftContract } = await deployContracts();
    await erc20Contract.transfer(user.address, 1);
    await erc20Contract.connect(user).approve(nftContract.address, 1);
    expect(await erc20Contract.balanceOf(user.address)).to.equal(1);

    // when
    await nftContract.connect(user).mint(user.address);

    // then
    expect(await erc20Contract.balanceOf(user.address)).to.equal(0);
    expect(await nftContract.ownerOf(0)).to.equal(user.address);
  });

  it("Calling mint on ERC721 should fail if ERC20 balance is low", async function () {
    // given
    const { user, erc20Contract, nftContract } = await deployContracts();
    await erc20Contract.connect(user).approve(nftContract.address, 1);

    // then
    await expect(
      nftContract.connect(user).mint(user.address)
    ).to.be.revertedWith("user does not hold a token");
  });

  it("Calling mint on ERC721 should fail if erc20TokenAddress is not set", async function () {
    // given
    const [erc20Owner, erc721Owner, user] = await ethers.getSigners();
    const ercContractFactory = await ethers.getContractFactory(
      "NoDecimalsERC20",
      erc20Owner
    );
    const nftContractFactory = await ethers.getContractFactory(
      "TestERC721",
      erc721Owner
    );
    const erc20Contract = await ercContractFactory.deploy(
      "Main Token",
      "MAIN",
      erc20Owner.address,
      100
    );
    await erc20Contract.deployed();
    const nftContract = await nftContractFactory.deploy();
    await nftContract.setErc20TokenAddress(
      "0x0000000000000000000000000000000000000000"
    );
    await nftContract.deployed();
    await erc20Contract.connect(user).approve(nftContract.address, 1);

    // then
    await expect(
      nftContract.connect(user).mint(user.address)
    ).to.be.revertedWith("erc20TokenAddress must be defined");
  });
});

async function deployContracts() {
  const [erc20Owner, erc721Owner, user] = await ethers.getSigners();
  const ercContractFactory = await ethers.getContractFactory(
    "NoDecimalsERC20",
    erc20Owner
  );
  const nftContractFactory = await ethers.getContractFactory(
    "TestERC721",
    erc721Owner
  );
  const erc20Contract = await ercContractFactory.deploy(
    "Main Token",
    "MAIN",
    erc20Owner.address,
    100
  );
  await erc20Contract.deployed();
  const nftContract = await nftContractFactory.deploy();
  await nftContract.setErc20TokenAddress(erc20Contract.address);
  await nftContract.deployed();
  return { user, erc20Contract, nftContract };
}
