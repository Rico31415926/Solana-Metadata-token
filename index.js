// 引入各模块
import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint ,mplTokenMetadata} from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { Keypair } from "@solana/web3.js"
import { readFileSync } from 'fs'

// 连接到 Solana devnet
const umi = createUmi('请替换您的quickNode 开发者网络节点')

// 使用 id.json 本地的私钥文件，实例化钱包
const userKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(readFileSync('./id.json', "utf-8")))
)

// 获取签名者
const userWallet = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

// 构建元数据
const metadata = {
    name: "Per aspera ad astra",
    symbol: "PAA",
    uri: "https://white-historical-basilisk-887.mypinata.cloud/ipfs/QmVd6xVRqg9sJQP1zkUVizZ7jah6zD7j6fSPn9F7MRjZMo",
}

// 生成 Mint 签名者
const mint = generateSigner(umi);

// 使用 use 方法配置 UMI 的签名者和元数据模块
umi.use(signerIdentity(userWalletSigner))
   .use(mplTokenMetadata())

// 打包发送 令牌铸造的交易
createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 3,
    amount: 666_000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted tokens (", mint.publicKey, ")");
})