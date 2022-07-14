import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155 mint burns ERC20 token", function () {
  it("Calling mint on ERC1155 should burn ERC20 token", async function () {
    // given
    const { user, erc20Contract, nftContract } = await deployContracts();
    await erc20Contract.transfer(user.address, 1);
    await erc20Contract.connect(user).approve(nftContract.address, 1);
    expect(await erc20Contract.balanceOf(user.address)).to.equal(1);

    // when
    await nftContract.connect(user).mint(user.address, 0, 1, "0x");

    // then
    expect(await erc20Contract.balanceOf(user.address)).to.equal(0);
    expect(await nftContract.balanceOf(user.address, 0)).to.equal(1);
  });

  it("Calling mint on ERC1155 should fail if ERC20 balance is low", async function () {
    // given
    const { user, erc20Contract, nftContract } = await deployContracts();
    await erc20Contract.connect(user).approve(nftContract.address, 1);

    // then
    await expect(
      nftContract.connect(user).mint(user.address, 0, 1, "0x")
    ).to.be.revertedWith("Insufficient ERC20 balance");
  });

  it("Calling mint on ERC1155 should fail if erc20TokenAddress is not set", async function () {
    // given
    const [erc20Owner, erc1155Owner, user] = await ethers.getSigners();
    const ercContractFactory = await ethers.getContractFactory(
      "NoDecimalsERC20",
      erc20Owner
    );
    const nftContractFactory = await ethers.getContractFactory(
      "TestERC1155",
      erc1155Owner
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
      nftContract.connect(user).mint(user.address, 0, 1, "0x")
    ).to.be.revertedWith("erc20TokenAddress undefined");
  });
});

async function deployContracts() {
  const [erc20Owner, erc1155Owner, user] = await ethers.getSigners();
  const ercContractFactory = await ethers.getContractFactory(
    "NoDecimalsERC20",
    erc20Owner
  );
  const nftContractFactory = await ethers.getContractFactory(
    "TestERC1155",
    erc1155Owner
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
