import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATConv

# 1. STAGE 1: Vision AI
class VisionPlumeDetector(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Conv2d(100, 64, kernel_size=3, padding=1)
        self.decoder = nn.Conv2d(64, 1, kernel_size=3, padding=1)
    def forward(self, x):
        features = F.relu(self.encoder(x))
        mask = torch.sigmoid(self.decoder(features))
        return mask, features

# 2. STAGE 2: Physics AI (PINN)
class MethaneQuantifierPINN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(64 + 3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 1, kernel_size=3, padding=1),
            nn.Softplus()
        )
    def forward(self, spectral, mask, wind):
        x = torch.cat((spectral, mask, wind), dim=1)
        return self.net(x) * mask

# 3. STAGE 3: Graph AI
class SourceAttributionGNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = GATConv(4, 16, heads=4, concat=True)
        self.conv2 = GATConv(64, 2, heads=1, concat=False)
    def forward(self, x, edge_index):
        x = F.elu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)