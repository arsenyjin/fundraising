pragma solidity 0.4.24;

import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/apps-agent/contracts/Agent.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";
import "@aragon/apps-shared-migrations/contracts/Migrations.sol";
import "@aragon/test-helpers/contracts/EtherTokenConstantMock.sol";
import "@aragon/test-helpers/contracts/TokenMock.sol";


// HACK to workaround truffle artifact loading on dependencies
contract TestImports {
  constructor() public {
    // to avoid lint error
  }
}
