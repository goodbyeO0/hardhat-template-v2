// SPDX-License-Identifier: MIT
// This line specifies the license under which the code is released

pragma solidity ^0.8.0;
// This pragma directive tells the compiler to use Solidity version 0.8.0 or higher

import "@openzeppelin/contracts/access/Ownable.sol";

// These import statements bring in OpenZeppelin's Ownable contract

contract QuadraticFunding is Ownable {
    // This line declares the QuadraticFunding contract, which inherits from Ownable

    struct Project {
        address payable owner;
        string name;
        uint256 totalContributions;
        uint256 contributorsCount;
        mapping(address => uint256) contributions;
    }
    // This struct defines the structure for a project in the quadratic funding system

    mapping(uint256 => Project) public projects;
    // This mapping stores all projects, indexed by their ID

    uint256 public projectCount;
    // This variable keeps track of the total number of projects

    uint256 public matchingPool;
    // This variable stores the total amount in the matching pool

    uint256 public roundEndTime;
    // This variable stores the timestamp when the funding round ends

    event ProjectCreated(uint256 indexed projectId, string name, address owner);
    event ContributionMade(
        uint256 indexed projectId,
        address contributor,
        uint256 amount
    );
    event MatchingDistributed(uint256 indexed projectId, uint256 amount);

    // These events are emitted when a project is created, a contribution is made, and matching funds are distributed

    constructor(
        address initialOwner,
        uint256 _roundDuration
    ) Ownable(initialOwner) {
        roundEndTime = block.timestamp + _roundDuration;
    }

    // The constructor initializes the contract with an initial owner and sets the round end time

    function createProject(string memory _name) external {
        require(block.timestamp < roundEndTime, "Funding round has ended");
        projectCount++;
        Project storage newProject = projects[projectCount]; // projects will has default value like 0, 0x
        newProject.owner = payable(msg.sender);
        newProject.name = _name;
        emit ProjectCreated(projectCount, _name, msg.sender);
    }

    // This function allows users to create a new project

    function contribute(uint256 _projectId) external payable {
        require(block.timestamp < roundEndTime, "Funding round has ended");
        require(
            _projectId > 0 && _projectId <= projectCount,
            "Invalid project ID"
        );
        require(msg.value > 0, "Contribution must be greater than 0");

        Project storage project = projects[_projectId];
        if (project.contributions[msg.sender] == 0) {
            project.contributorsCount++;
        }
        project.contributions[msg.sender] += msg.value;
        project.totalContributions += msg.value;

        emit ContributionMade(_projectId, msg.sender, msg.value);
    }

    // This function allows users to contribute to a project

    function addToMatchingPool() external payable {
        // anyone can add to matching pool
        matchingPool += msg.value;
    }

    // This function allows the owner to add funds to the matching pool

    function calculateMatchingAmount(
        uint256 _projectId
    ) public view returns (uint256) {
        Project storage project = projects[_projectId];
        uint256 sqrtSum = 0;
        uint256 projectValue = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            uint256 value = sqrt(
                projects[i].totalContributions * projects[i].contributorsCount
            );
            sqrtSum += value * value;
            if (i == _projectId) {
                projectValue = value;
            }
        }

        return (projectValue * projectValue * matchingPool) / sqrtSum;
    }

    // This function calculates the matching amount for a project based on quadratic funding formula

    function distributeMatching() external onlyOwner {
        require(
            block.timestamp >= roundEndTime,
            "Funding round has not ended yet"
        );

        for (uint256 i = 1; i <= projectCount; i++) {
            uint256 matchingAmount = calculateMatchingAmount(i);
            projects[i].owner.transfer(matchingAmount);
            emit MatchingDistributed(i, matchingAmount);
        }

        matchingPool = 0;
    }

    // This function distributes the matching funds to projects after the round ends

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // This is a helper function to calculate the square root of a number

    function getProjectDetails(
        uint256 _projectId
    )
        external
        view
        returns (
            address owner,
            string memory name,
            uint256 totalContributions,
            uint256 contributorsCount,
            uint256 matchingAmount,
            uint256 totalAmount
        )
    {
        Project storage project = projects[_projectId];
        uint256 matching = calculateMatchingAmount(_projectId);
        uint256 total = project.totalContributions + matching;
        return (
            project.owner,
            project.name,
            project.totalContributions,
            project.contributorsCount,
            matching,
            total
        );
    }

    // This function returns the details of a specific project

    function getContribution(
        uint256 _projectId,
        address _contributor
    ) external view returns (uint256) {
        return projects[_projectId].contributions[_contributor];
    }

    // This function returns the contribution amount of a specific contributor to a specific project

    function calculateTotalAmount(
        uint256 _projectId
    ) public view returns (uint256) {
        Project storage project = projects[_projectId];
        uint256 matchingAmount = calculateMatchingAmount(_projectId);
        return project.totalContributions + matchingAmount;
    }
}
