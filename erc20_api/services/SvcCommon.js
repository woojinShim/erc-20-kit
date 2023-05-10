var Response = require("../common/Response");
var Code = require("../common/Code");
var MysqlConn = require("../common/MysqlConn.js");
var _SqlFormat = { language: "sql", indent: "  " };
var util = require("util");
require("dotenv").config();
const Web3 = require("web3");
const { ethers } = require("ethers");
const contract = require("../config/contract");
const { parseEther, formatEther } = require("ethers/lib/utils");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL
);
const admin = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const web3 = new Web3(process.env.SEPOLIA_RPC_URL);
const abi = contract.abi;
const tokenAddress = contract.tokenAddress;

class SvcCommon {
  constructor(cmd, body, req, res, t) {
    (this._cmd = cmd), (this._body = body);
    this._req = req;
    this._res = res;
    this._t = t;
  }

  async v1_test() {
    let resdata = {};
    let code = Code.OK;
    var param = {
      nftContract: this._body.nftContract,
      nftId: this._body.nftId,
    };

    // assign
    // var sql = MysqlConn.MAKESQL("repo", "selectItemSell", param, _SqlFormat);

    // let connection = null;
    // try {
    //   connection = await MysqlConn.pool.getConnection(async (conn) => conn);
    //   let rs = await connection.query(sql);
    //   resdata.itemsells = rs[0];
    // } catch (err) {
    //   code = Code.FAILED;
    //   _logger.error(err.stack);
    // } finally {
    //   try {
    //     connection.release();
    //   } catch (err) {}
    // }

    this._res.json(new Response(this._cmd, code, resdata, this._t).build());
  }

  async v1_txFee() {
    let resdata = {};
    let code = Code.OK;
    var param = {};

    try {
      /** Estimated transaction fee */
      const gasPrice = (await provider.getGasPrice()).toString();
      resdata.txFee = gasPrice;
    } catch (err) {
      code = Code.FAILED;
      _logger.error(err.error);
    } finally {
    }

    this._res.json(new Response(this._cmd, code, resdata, this._t).build());
  }

  async v1_sendToken() {
    let resdata = {};
    let code = Code.OK;
    var param = {
      walletAddress: this._body.walletAddress,
      amount: this._body.amount,
    };
    let res;

    const gasPrice = (await provider.getGasPrice()).toString();
    const token = new ethers.Contract(tokenAddress, abi, admin);

    try {
      /** Mint token to user */
      let tx = await token.mint(param.walletAddress, param.amount, {
        gasPrice,
      });
      res = tx.hash;
      await tx.wait();
      _logger.debug(`Transaction Hash ${util.inspect(res)}`);

      const txHash = await provider.getTransactionReceipt(res);
      /** Get minted token value from transaction receipt */
      const value = web3.utils.hexToNumberString(txHash.logs[0].data);
      resdata.transactionHash = txHash.transactionHash;
      resdata.value = formatEther(value);
    } catch (err) {
      code = Code.FAILED;
      _logger.error(err.error);
    } finally {
    }

    this._res.json(new Response(this._cmd, code, resdata, this._t).build());
  }
}

module.exports = SvcCommon;
