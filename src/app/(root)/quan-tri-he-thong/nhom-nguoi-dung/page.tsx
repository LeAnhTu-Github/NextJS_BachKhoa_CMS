'use client'
import React, { useEffect, useState, useCallback } from 'react'
import GroupListItem from '@/components/GroupUser/GroupSidebar/GroupListItem'
import GroupDetailTag from '@/components/GroupUser/GroupDetail/GroupDetailTag'
import { GroupResponse } from '@/types/GroupReponse'
import { Group } from '@/types/User'
import { getGroups, getGroupDetail } from '@/services/groupService'

const GroupUserPage = () => {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [groupDetail, setGroupDetail] = useState<GroupResponse | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  const handleSelectGroup = useCallback(async (groupId: number) => {
    setSelectedGroupId(groupId)
    try {
      const groupDetail = await getGroupDetail(groupId)
      setGroupDetail(groupDetail)
    } catch (error) {
      console.error('Error fetching group detail:', error)
    }
  }, [])

  const fetchGroupList = useCallback(async () => {
    const groups = await getGroups()
    setGroupList(groups)
  }, [])


  useEffect(() => {
    fetchGroupList()
  }, [fetchGroupList])
  
  useEffect(() => {
    if (groupList.length > 0 && !selectedGroupId) {
      const firstGroupId = groupList[0].id
      setSelectedGroupId(firstGroupId)
      getGroupDetail(firstGroupId).then(setGroupDetail)
    }
  }, [groupList, selectedGroupId])

  return (
    <div className='w-full h-full flex flex-col gap-3 lg:flex-row p-3'>
      <GroupListItem 
        groupList={groupList} 
        refreshGroupList={fetchGroupList} 
        handleSelectGroup={handleSelectGroup}
        selectedGroupId={selectedGroupId}
      />
      <GroupDetailTag groupDetail={groupDetail} refreshGroupList={fetchGroupList} />
    </div>
  )
}

export default GroupUserPage