import React from 'react';
import { DocumentLayout } from '@/components/layout/DocumentLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/shared/Button";
import { toast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  FileText, 
  Users, 
  ArrowRight, 
  Check, 
  X, 
  Clock,
  Vote
} from 'lucide-react';

// Mock user session
const mockUser = {
  address: 'user123',
  connect: () => Promise.resolve()
};

const DAOGovernance = () => {
  const { address, connect } = mockUser;

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    if (!address) {
      toast({
        title: "Please sign in",
        description: "Please sign in to vote on proposals.",
        variant: "destructive",
      });
      return;
    }
    
    // This would be implemented to interact with the DAO smart contract
    toast({
      title: "Vote recorded",
      description: `You voted ${vote} proposal #${proposalId}`,
    });
  };

  return (
    <DocumentLayout
      title="DAO Governance"
      description="Participate in decentralized decision-making for the PoolChain platform."
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How PoolChain DAO Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-brand-600" />
                Propose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                POOL token holders can create proposals to improve the platform, update parameters, or allocate resources.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Vote className="h-5 w-5 mr-2 text-brand-600" />
                Vote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Community members vote on active proposals using their POOL tokens. One token equals one vote.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-brand-600" />
                Execute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Approved proposals are automatically implemented through smart contracts, ensuring transparent governance.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Active Proposals</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Proposal #37</CardTitle>
                  <CardDescription>Reduce platform fees from 5% to 3%</CardDescription>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  Voting Active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This proposal aims to reduce the platform fees charged on ride payments to encourage wider adoption and make carpooling more affordable for all participants.
              </p>
              <div className="mb-2 flex justify-between text-sm">
                <span>For: 62%</span>
                <span>Against: 38%</span>
              </div>
              <Progress value={62} className="h-2 mb-4" />
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  127 voters
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Ends in 3 days
                </span>
                <span className="flex items-center">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Quorum: 75% reached
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleVote('37', 'against')}
                iconLeft={<X className="h-4 w-4" />}
              >
                Vote Against
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => handleVote('37', 'for')}
                iconLeft={<Check className="h-4 w-4" />}
              >
                Vote For
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Proposal #36</CardTitle>
                  <CardDescription>Add support for new payment tokens</CardDescription>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  Voting Active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This proposal suggests adding support for USDC and DAI as payment options on the platform, in addition to the currently supported tokens.
              </p>
              <div className="mb-2 flex justify-between text-sm">
                <span>For: 89%</span>
                <span>Against: 11%</span>
              </div>
              <Progress value={89} className="h-2 mb-4" />
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  203 voters
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Ends in 1 day
                </span>
                <span className="flex items-center">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Quorum: 85% reached
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleVote('36', 'against')}
                iconLeft={<X className="h-4 w-4" />}
              >
                Vote Against
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => handleVote('36', 'for')}
                iconLeft={<Check className="h-4 w-4" />}
              >
                Vote For
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Past Proposals</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Proposal #35</CardTitle>
                    <CardDescription>Implement driver insurance program</CardDescription>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Passed
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This proposal approved the allocation of treasury funds to establish an insurance program for drivers, providing coverage in case of accidents or damages.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-brand-600"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Proposal #34</CardTitle>
                    <CardDescription>Expand to South American markets</CardDescription>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Passed
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This proposal approved the expansion of PoolChain services to major cities in Brazil, Argentina, and Colombia, with a budget allocation for local marketing and partnerships.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-brand-600"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Proposal #33</CardTitle>
                    <CardDescription>Change reward distribution model</CardDescription>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                    Rejected
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This proposal suggested changing the token reward distribution model to favor long-distance rides more heavily than short rides. The community voted against this change.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-brand-600"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {!address && (
          <div className="mt-8 p-6 border border-border rounded-lg bg-muted/50">
            <h3 className="text-lg font-medium mb-2">Sign In to Participate</h3>
            <p className="mb-4 text-muted-foreground">
              You need to sign in and hold POOL tokens to vote on proposals or create new ones.
            </p>
            <Button variant="primary" onClick={connect}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    </DocumentLayout>
  );
};

export default DAOGovernance;
