const { expect } = require("chai");
const { ethers } = require("hardhat");
const { formatEther, parseEther } = require("ethers/lib/utils");

describe("ERC-20 Test", () => {
  let token;
  let owner, addr;
  let originMaxSupply;

  beforeEach(async () => {
    [owner, ...addr] = await ethers.getSigners();

    const tokenERC20 = await ethers.getContractFactory("tokenERC20");
    token = await tokenERC20.deploy();
    await token.deployed();
    originMaxSupply = await token.mintableAmount();
  });

  describe("token", () => {
    it("Owner can mint tokens to other's address.", async () => {
      let tx = await token.mint(addr[0].address, 30);
      await tx.wait();
      tx = await token.mint(addr[1].address, 10);
      await tx.wait();
      tx = await token.mint(addr[2].address, 12);
      await tx.wait();

      const ownerBalance = await token.balanceOf(owner.address);

      const addrBalance = await token.balanceOf(addr[0].address);
      expect(ownerBalance).to.equal(addrBalance.sub(parseEther("30")));
      const addr2Balance = await token.balanceOf(addr[1].address);
      expect(ownerBalance).to.equal(addr2Balance.sub(parseEther("10")));
      const addr3Balance = await token.balanceOf(addr[2].address);
      expect(ownerBalance).to.equal(addr3Balance.sub(parseEther("12")));
    });

    it("cannot mint not owner", async () => {
      await expect(
        token.connect(addr[0]).mint(addr[0].address, 1000)
      ).to.revertedWith("Ownable: caller is not the owner");
    });

    it("Owner can transfer tokens to other's address.", async () => {
      let tx = await token.mint(addr[0].address, 100);
      await tx.wait();

      await token.connect(addr[0]).transfer(addr[1].address, parseEther("50"));
      expect(await token.balanceOf(addr[1].address)).to.equal(parseEther("50"));
      expect(await token.balanceOf(addr[0].address)).to.equal(parseEther("50"));
    });

    it("Transfer event becomes emit.", async () => {
      expect(await token.mint(addr[0].address, 100))
        .to.emit(token, "Transfer")
        .withArgs(addr[0].address, 100);
    });

    it("cannot transfer more than token owner's current balance.", async () => {
      await expect(
        token.connect(addr[0]).transfer(addr[2].address, 50)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("is not possible to send more tokens than mintableAmount", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal("0");
      await expect(
        token.mint(addr[3].address, parseEther("1000000000000000000"))
      ).to.be.revertedWith("ERC20: Amount is more than allowed");
    });

    it("mintableAmount should be equal to the total amount minus the issued amount.", async () => {
      let tx = await token.mint(addr[0].address, 20);
      await tx.wait();
      tx = await token.mint(addr[1].address, 30);
      await tx.wait();
      tx = await token.mint(addr[2].address, 100);
      await tx.wait();

      expect(await token.mintableAmount()).to.be.equal(
        originMaxSupply.sub(150)
      );
    });

    it("can transfer tokens after receiving approval from the token owner.", async () => {
      let tx = await token.mint(addr[0].address, 20);
      await tx.wait();
      expect(await token.balanceOf(addr[0].address)).to.equal(parseEther("20"));
      tx = await token
        .connect(addr[0])
        .approve(addr[1].address, parseEther("10"));
      await tx.wait();
      tx = await token
        .connect(addr[1])
        .transferFrom(addr[0].address, addr[2].address, parseEther("10"));
      await tx.wait();
      expect(await token.balanceOf(addr[0].address)).to.equal(parseEther("10"));
      expect(await token.balanceOf(addr[2].address)).to.equal(parseEther("10"));
    });

    it("Approve event becomes emit.", async () => {
      let tx = await token.mint(addr[0].address, 20);
      await tx.wait();
      tx = await token.connect(addr[0]).approve(addr[1].address, 10);
      await tx.wait();
      expect(await token.connect(addr[0]).approve(addr[1].address, 10))
        .to.emit(token, "approve")
        .withArgs(addr[1].address, 10);
    });
  });
});
