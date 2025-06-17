'use client'
import React, { useEffect, useState, useCallback } from 'react'
import api from '@/services/api'
import GroupListItem from '@/components/GroupUser/GroupSidebar/GroupListItem'
import GroupDetailTag from '@/components/GroupUser/GroupDetail/GroupDetailTag'
import { GroupResponse } from '@/types/GroupReponse'
import { Group } from '@/types/User'

const GroupUserPage = () => {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [groupDetail, setGroupDetail] = useState<GroupResponse | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  const handleSelectGroup = useCallback(async (groupId: number) => {
    setSelectedGroupId(groupId)
    const response = await api.get(`/auth/group/${groupId}`)
    setGroupDetail(response.data.data)
  }, [])

  const fetchGroupList = useCallback(async () => {
    const response = await api.get('/auth/group')
    setGroupList(response.data.data)
  }, [])

  const refreshGroupList = useCallback(async () => {
    const response = await api.get('/auth/group')
    setGroupList(response.data.data)
  }, [])

  useEffect(() => {
    fetchGroupList()
  }, [fetchGroupList])

  useEffect(() => {
    if (groupList.length > 0 && !selectedGroupId) {
      handleSelectGroup(groupList[0].id)
    }
  }, [groupList, selectedGroupId, handleSelectGroup])
  return (
    <div className='w-full h-full flex flex-col gap-3 lg:flex-row p-3'>
      <GroupListItem 
        groupList={groupList} 
        refreshGroupList={refreshGroupList} 
        handleSelectGroup={handleSelectGroup}
        selectedGroupId={selectedGroupId}
      />
      <GroupDetailTag groupDetail={groupDetail} />
    </div>
  )
}

export default GroupUserPage