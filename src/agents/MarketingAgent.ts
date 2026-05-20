import { BaseAgent } from '../core/BaseAgent';
import { EventBus } from '../core/EventBus';

export class MarketingAgent extends BaseAgent {
  private campaigns: any[] = [];

  constructor(config: {
    id: string;
    name: string;
    description: string;
    eventBus: EventBus;
  }) {
    super(config);
    this.checkInterval = 15000; // 15 seconds
  }

  protected async onInit() {
    this.log('Marketing engine initialized');
    this.campaigns = [];
  }

  protected async onWakeUp() {
    this.log('Marketing systems online - ready to run campaigns');
    this.eventBus.emit('agent.marketing.ready', {
      timestamp: new Date(),
      agentId: this.id
    });
  }

  protected async onSleep() {
    this.log('Marketing systems going dormant');
  }

  protected async onCycle() {
    // Simulate campaign monitoring
    this.campaigns.forEach(campaign => {
      if (campaign.status === 'running') {
        campaign.impressions += Math.floor(Math.random() * 100);
        campaign.clicks += Math.floor(Math.random() * 10);
        campaign.conversions += Math.floor(Math.random() * 2);
      }
    });

    if (this.campaigns.length > 0) {
      this.eventBus.emit('campaign.updated', {
        campaigns: this.campaigns,
        timestamp: new Date()
      });
    }
  }

  public createCampaign(data: any) {
    const campaign = {
      id: `campaign-${Date.now()}`,
      name: data.name,
      platform: data.platform, // 'facebook', 'instagram', 'google', 'tiktok'
      budget: data.budget,
      audience: data.audience,
      status: 'draft',
      createdAt: new Date(),
      impressions: 0,
      clicks: 0,
      conversions: 0
    };

    this.campaigns.push(campaign);
    this.log(`Created campaign: ${campaign.name}`);

    this.eventBus.emit('campaign.created', {
      campaign,
      timestamp: new Date()
    });

    return campaign;
  }

  public launchCampaign(campaignId: string) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      campaign.status = 'running';
      this.log(`Launched campaign: ${campaign.name}`);
      this.eventBus.emit('campaign.launched', {
        campaign,
        timestamp: new Date()
      });
      return campaign;
    }
    throw new Error(`Campaign ${campaignId} not found`);
  }

  public stopCampaign(campaignId: string) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      campaign.status = 'paused';
      this.log(`Paused campaign: ${campaign.name}`);
      return campaign;
    }
    throw new Error(`Campaign ${campaignId} not found`);
  }

  public getCampaigns() {
    return this.campaigns;
  }

  public getCampaignById(id: string) {
    return this.campaigns.find(c => c.id === id);
  }

  public getMetrics() {
    return {
      totalCampaigns: this.campaigns.length,
      activeCampaigns: this.campaigns.filter(c => c.status === 'running').length,
      totalBudget: this.campaigns.reduce((sum, c) => sum + c.budget, 0),
      totalImpressions: this.campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: this.campaigns.reduce((sum, c) => sum + c.clicks, 0),
      totalConversions: this.campaigns.reduce((sum, c) => sum + c.conversions, 0)
    };
  }
}
