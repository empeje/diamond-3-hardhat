/* global ethers */
/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function deployDiamond () {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.deployed()
  console.log('DiamondCutFacet deployed:', diamondCutFacet.address)

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacet.address)
  await diamond.deployed()
  console.log('Diamond deployed:', diamond.address)

  return diamond;
}
/*
  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory('DiamondInit')
  const diamondInit = await DiamondInit.deploy()
  await diamondInit.deployed()
  console.log('DiamondInit deployed:', diamondInit.address)
  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'DiamondLoupeFacet',
    'OwnershipFacet'
  ]
  */

async function  deployA() {
  const Facet = await ethers.getContractFactory("A")
  const facet = await Facet.deploy()
  await facet.deployed()
  console.log('A deployed:', facet.address)
  return facet;
}

async function replaceA(diamond) {
  const cut = []
  const facet = await deployA();
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Replace,
    functionSelectors: getSelectors(facet)
  })
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond)
  const tx = await diamondCut.diamondCut(cut, "0x0000000000000000000000000000000000000000", [])
  console.log('Diamond cut tx: ', tx.hash)
  const receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
  return diamond
  /*
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
  }
  */
}
async function addA(diamond) {
  const cut = []
  const facet = await deployA();
  cut.push({
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: getSelectors(facet)
  })
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
  const tx = await diamondCut.diamondCut(cut, "0x0000000000000000000000000000000000000000", [])
  console.log('Diamond cut tx: ', tx.hash)
  const receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
  return diamond.address
  /*
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
  }
  */
}

  /*
  // upgrade diamond with facets
  console.log('')
  console.log('Diamond Cut:', cut)
  let tx
  let receipt
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData('init')

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
*/
//  deployDiamond().then(addA)

async function callA() {
  const diamondAddr = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
  const a = await ethers.getContractAt("IA", diamondAddr)
  console.log("a", await a.getA());
}

//replaceA("0x162A433068F51e18b7d13932F27e66a3f99E6890")
callA();

exports.deployDiamond = deployDiamond
