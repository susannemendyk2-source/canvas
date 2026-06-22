<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">用户管理 / User Management</h1>
      <p class="mt-1 text-sm text-white/45">管理平台用户 / Manage platform users</p>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <label class="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white/42">
        <Search class="size-4" />
        <input v-model="searchQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" placeholder="搜索用户 / Search users" />
      </label>
    </div>

    <div class="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/8 text-left text-xs text-white/45">
            <th class="px-4 py-3 font-medium">ID</th>
            <th class="px-4 py-3 font-medium">用户名 / Username</th>
            <th class="px-4 py-3 font-medium">邮箱 / Email</th>
            <th class="px-4 py-3 font-medium">状态 / Status</th>
            <th class="px-4 py-3 font-medium">星尘 / Credits</th>
            <th class="px-4 py-3 font-medium">角色 / Roles</th>
            <th class="px-4 py-3 font-medium">创建时间 / Created</th>
            <th class="px-4 py-3 font-medium">操作 / Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-white/5 transition hover:bg-white/5">
            <td class="px-4 py-3 text-white/60">{{ user.id }}</td>
            <td class="px-4 py-3 font-medium">{{ user.username }}</td>
            <td class="px-4 py-3 text-white/60">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="['rounded-full px-2 py-0.5 text-[11px]', user.status === 1 ? 'bg-emerald-500/12 text-emerald-300' : 'bg-white/8 text-white/45']">
                {{ user.status === 1 ? '启用 / Active' : '禁用 / Disabled' }}
              </span>
            </td>
            <td class="px-4 py-3">{{ user.credits }}</td>
            <td class="px-4 py-3 text-white/60">{{ user.roles || 'USER' }}</td>
            <td class="px-4 py-3 text-white/45 text-xs">{{ user.createdAt }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="toggleStatus(user)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/60 hover:text-white">{{ user.status === 1 ? '禁用' : '启用' }}</button>
                <button @click="adjustCredits(user)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/60 hover:text-white">星尘</button>
                <button @click="assignRole(user)" class="rounded-md border border-white/8 bg-white/6 px-2 py-1 text-xs text-white/60 hover:text-white">角色</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')

interface AdminUser {
  id: number
  username: string
  email: string
  status: number
  credits: number
  roles: string
  createdAt: string
}

const users = ref<AdminUser[]>([])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
})

function toggleStatus(user: AdminUser) {
  user.status = user.status === 1 ? 0 : 1
}

function adjustCredits(user: AdminUser) {
  const amount = prompt(`调整 ${user.username} 的星尘点数`)
  if (amount) {
    user.credits += Number(amount)
  }
}

function assignRole(user: AdminUser) {
  const role = prompt(`为 ${user.username} 分配角色 (USER / ADMIN):`)
  if (role) {
    user.roles = role.toUpperCase()
  }
}

onMounted(async () => {
  try {
    const { adminService } = await import('~/services/adminService')
    const res: any = await adminService.listUsers({})
    users.value = res.data || res || []
  } catch {
    users.value = []
  }
})
</script>
