import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TicketListView from './TicketListView'
import { TabContext, TabList } from '@mui/lab'

const TicketsView = () => {
  const { search } = useLocation()
  const [selectedTab, setSelectedTab] = useState('0')

  useEffect(() => {
    const queryParams = new URLSearchParams(search)
    const activeTab = queryParams.get('activeTab')
    setSelectedTab(activeTab === 'invalid' ? '1' : '0')
  }, [search])
  return (
    <div>
      <TabContext value={selectedTab}>
        <TabList aria-label="ticket tabs" variant='fullWidth'>
        <Tab
          label="Érvényes"
          value='0'
          component={Link}
          to='?activeTab=valid'
        />
        <Tab
          label="Lejárt"
          value='1'
          component={Link}
          to='?activeTab=invalid'
        />
        </TabList>
        <TabPanel value='0' sx={{ padding: 0 }}>
          <TicketListView valid />
        </TabPanel>
        <TabPanel value='1' sx={{ padding: 0 }}>
          <TicketListView valid={false} />
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default TicketsView
