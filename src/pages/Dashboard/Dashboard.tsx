// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from '../../@core/components/icon'

// ** Type Import
import { CardStatsCharacterProps } from '../../@core/components/card-statistics/types';

// ** Custom Components Imports
import CardStatisticsCharacter from './components/CardStatisticsCharacter';
import CardStatisticsVerticalComponent from './components/CardStatisticsVerticalComponent';

// ** Styled Component Import
import ApexChartWrapper from './components/ApexChartWrapper';

//Components
import CrmTotalSales from './components/CrmTotalSales'
import CrmWeeklySales from './components/CrmWeeklySales'
import CrmTotalGrowth from './components/CrmTotalGrowth'
import CrmTransactions from './components/CrmTransactions'
import CrmRevenueReport from './components/CrmRevenueReport'
import CrmSalesOverview from './components/CrmSalesOverview'


const data: CardStatsCharacterProps[] = [
  {
    stats: '13k',
    title: 'Calls',
    trendNumber: '+15.6%',
    chipColor: 'primary',
    chipText: 'Year of 2023',
    src: '/images/cards/pose_f9.png'
  },
  {
    stats: '24.5k',
    trend: 'negative',
    title: 'Leads',
    trendNumber: '+22%',
    chipText: 'Last Week',
    chipColor: 'secondary',
    src: '/images/cards/pose_m18.png'
  }
]

const CRMDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container alignItems="flex-end" spacing={6}>
        <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(12.25)} !important` }}>
          <CardStatisticsCharacter data={data[0]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(12.25)} !important` }}>
          <CardStatisticsCharacter data={data[1]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CrmTransactions />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CrmTotalSales />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CrmRevenueReport />
        </Grid>
        <Grid item xs={12} md={6}>
          <CrmSalesOverview />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={8}>
              <CrmWeeklySales />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={6}>
                <Grid item xs={6} sm={12}>
                  <CrmTotalGrowth />
                </Grid>
                <Grid item xs={6} sm={12}>
                  <CardStatisticsVerticalComponent
                    stats='862'
                    trend='negative'
                    trendNumber='-18%'
                    title='New Project'
                    subtitle='Yearly Project'
                    icon={<Icon icon='mdi:briefcase-variant-outline' />} bgColor={''} number={''}                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CRMDashboard
