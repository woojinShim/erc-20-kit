const { ethers } = require("hardhat");

async function main() {
  const tokenERC20 = await ethers.getContractFactory("tokenERC20");
  const token = await tokenERC20.deploy();
  await token.deployed();

  console.log("tokenERC20 deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
