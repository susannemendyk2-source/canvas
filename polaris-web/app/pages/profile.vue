<template>
  <div class="mx-auto flex min-h-screen max-w-7xl gap-0 px-4 py-6 lg:gap-6">
    <aside class="hidden w-56 shrink-0 lg:block">
      <div class="sticky top-20 rounded-xl border border-white/10 bg-white/[0.04] p-2">
        <div class="mb-3 flex items-center gap-3 border-b border-white/8 px-3 pb-3">
          <div v-if="authStore.user?.avatar" class="size-10 overflow-hidden rounded-full">
            <img :src="authStore.user.avatar" class="size-full object-cover" />
          </div>
          <div v-else class="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white">{{ profileInitial }}</div>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-white">{{ userName }}</p>
            <p class="truncate text-xs text-white/42">{{ userEmail || t('未设置邮箱', 'No email') }}</p>
          </div>
        </div>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition"
          :class="activeTab === tab.id ? 'bg-cyan-100/10 text-cyan-50' : 'text-white/55 hover:bg-white/6 hover:text-white'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </div>
    </aside>

    <div class="min-w-0 flex-1">
      <section class="mb-4 flex items-center gap-3 lg:hidden">
        <button class="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:bg-white/8 hover:text-white" @click="navigateTo('/studio')">
          <ArrowLeft class="size-4" />
        </button>
        <div class="flex gap-1 overflow-x-auto rounded-lg bg-black/30 p-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="activeTab === tab.id ? 'bg-cyan-300/18 text-cyan-50' : 'text-white/55 hover:text-white/80'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </section>

      <!-- ========== 画布管理 ========== -->
      <section v-if="activeTab === 'projects'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-white">{{ t('画布管理', 'Canvas Projects') }}</h1>
            <p class="mt-0.5 text-sm text-white/45">{{ t('管理已保存的画布项目', 'Manage your saved canvas projects') }}</p>
          </div>
          <NuxtLink to="/studio" class="inline-flex h-9 items-center gap-2 rounded-lg bg-cyan-100 px-4 text-sm font-medium text-[#061018] transition hover:bg-white">
            <Plus class="size-4" />
            {{ t('新建', 'New') }}
          </NuxtLink>
        </div>

        <div class="flex gap-2">
          <label class="flex h-9 max-w-xs flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm text-white/42">
            <Search class="size-4" />
            <input v-model="projectQuery" class="w-full bg-transparent outline-none placeholder:text-white/32" :placeholder="t('搜索画布', 'Search canvases')" />
          </label>
        </div>

        <div v-if="filteredProjects.length === 0" class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-20 text-white/35">
          <Layout class="mb-3 size-10" />
          <p class="text-sm">{{ t('暂无保存的画布', 'No saved canvases yet') }}</p>
          <NuxtLink to="/studio" class="mt-3 text-xs text-cyan-300/70 underline underline-offset-2 hover:text-cyan-200">{{ t('前往画布创建', 'Go to studio') }}</NuxtLink>
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="project in filteredProjects" :key="project.id" class="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:border-cyan-100/25 hover:bg-white/[0.06] hover:shadow-lg" @click="openProject(project.id)">
            <!-- Preview header -->
            <div class="relative flex h-24 items-end overflow-hidden rounded-t-lg px-4 pb-3" :class="previewBg(project.mode || project.type)">
              <span v-if="projectRunningTasks[project.id]" class="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-medium text-amber-200 backdrop-blur-sm">
                <span class="inline-block size-2 animate-pulse rounded-full bg-amber-400" />
                {{ t('生成中', 'Generating') }}
              </span>
              <span class="absolute right-2 top-2 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70 backdrop-blur-sm">{{ modeLabel(project.mode || project.type) }}</span>
              <div class="flex items-center gap-2 text-xs text-white/60">
                <component :is="modeIcon(project.mode || project.type)" class="size-4 text-white/80" />
                <span>{{ project.updatedAt ? timeAgo(project.updatedAt) : project.createdAt ? timeAgo(project.createdAt) : '' }}</span>
              </div>
            </div>
            <!-- Body -->
            <div class="p-4 pt-3">
              <h3 class="line-clamp-1 text-sm font-semibold text-white">{{ project.name || project.title || t('未命名项目', 'Untitled') }}</h3>
              <p class="mt-1 line-clamp-2 min-h-7 text-xs text-white/45">{{ project.description || t('暂无描述', 'No description') }}</p>
              <div class="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                <div class="flex items-center gap-3 text-[11px] text-white/40">
                  <span class="flex items-center gap-1">
                    <Layout class="size-3" />
                    {{ projectObjectCounts[project.id] ?? '...' }} {{ t('卡片', 'cards') }}
                  </span>
                </div>
                <div class="flex gap-1 opacity-0 transition group-hover:opacity-100" @click.stop>
                  <button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-cyan-100/10 hover:text-cyan-50" :title="t('打开', 'Open')" @click="openProject(project.id)">
                    <ExternalLink class="size-3.5" />
                  </button>
                  <button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-amber-100/10 hover:text-amber-300" :title="t('重命名', 'Rename')" @click="startRename(project)">
                    <Pencil class="size-3.5" />
                  </button>
                  <button class="grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-red-100/10 hover:text-red-400" :title="t('删除', 'Delete')" @click="confirmDelete(project)">
                    <Trash2 class="size-3.5" />
                  </button>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Rename dialog -->
        <Teleport to="body">
          <div v-if="renaming" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="renaming = null">
            <div class="w-80 rounded-xl border border-white/10 bg-[#10131a] p-5 shadow-glass" @click.stop>
              <h3 class="text-sm font-semibold text-white">{{ t('重命名项目', 'Rename Project') }}</h3>
              <input v-model="renameValue" class="mt-3 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-cyan-400/60" @keydown.enter="doRename" />
              <div class="mt-4 flex justify-end gap-2">
                <button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10" @click="renaming = null">{{ t('取消', 'Cancel') }}</button>
                <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="doRename">{{ t('确认', 'Confirm') }}</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Delete confirm dialog -->
        <Teleport to="body">
          <div v-if="deleting" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="deleting = null">
            <div class="w-80 rounded-xl border border-white/10 bg-[#10131a] p-5 shadow-glass" @click.stop>
              <h3 class="text-sm font-semibold text-white">{{ t('删除项目', 'Delete Project') }}</h3>
              <p class="mt-2 text-xs text-white/55">{{ t('确定要删除', 'Are you sure to delete') }} "{{ deleting.name || deleting.title }}"？</p>
              <div class="mt-4 flex justify-end gap-2">
                <button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10" @click="deleting = null">{{ t('取消', 'Cancel') }}</button>
                <button class="h-9 rounded-lg bg-red-500 px-4 text-xs font-medium text-white transition hover:bg-red-400" @click="doDelete">{{ t('删除', 'Delete') }}</button>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <!-- ========== 积分管理 ========== -->
      <section v-if="activeTab === 'credits'" class="space-y-4">
        <div>
          <h1 class="text-xl font-semibold text-white">{{ t('积分管理', 'Credits') }}</h1>
          <p class="mt-0.5 text-sm text-white/45">{{ t('用于生成图片、视频和工作流任务', 'Used for image, video and workflow generation') }}</p>
        </div>

        <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm text-white/45">{{ t('当前余额', 'Current Balance') }}</p>
                <p class="mt-2 text-4xl font-semibold text-cyan-50">{{ authStore.credits.toLocaleString() }}</p>
              </div>
              <div class="grid size-14 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-cyan-100">
                <Crown class="size-6" />
              </div>
            </div>
            <div class="mt-4 grid gap-2 sm:grid-cols-3">
              <button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50" @click="addDemoCredits(500)">
                {{ t('测试增加 500', 'Add 500 Demo') }}
              </button>
              <button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50" @click="spendDemoCredits(40)">
                {{ t('模拟图片生成', 'Simulate Image') }}
              </button>
              <button class="h-9 rounded-lg border border-white/10 bg-white/6 text-xs text-white/72 transition hover:border-cyan-200/30 hover:text-cyan-50" @click="spendDemoCredits(120)">
                {{ t('模拟视频生成', 'Simulate Video') }}
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <h2 class="text-sm font-semibold text-white">{{ t('消耗规则', 'Usage Cost') }}</h2>
            <div class="mt-3 space-y-2">
              <div v-for="item in costs" :key="item.name" class="flex items-center justify-between rounded-md border border-white/8 bg-black/20 px-3 py-2">
                <span class="text-sm text-white/72">{{ item.name }}</span>
                <span class="text-sm font-medium text-cyan-100">{{ item.cost }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          <div class="flex items-center justify-between border-b border-white/8 px-5 py-3">
            <h2 class="text-sm font-semibold text-white">{{ t('积分流水', 'Credit Log') }}</h2>
            <button class="text-xs text-white/45 transition hover:text-white" @click="clearLogs">{{ t('清空记录', 'Clear Log') }}</button>
          </div>
          <div v-if="creditLogs.length === 0" class="flex flex-col items-center justify-center py-14 text-white/35">
            <Coins class="mb-2 size-8" />
            <p class="text-sm">{{ t('暂无记录', 'No records yet') }}</p>
          </div>
          <div v-for="log in creditLogs" :key="log.id" class="flex items-center justify-between border-b border-white/5 px-5 py-3 last:border-b-0">
            <div class="flex min-w-0 items-center gap-3">
              <div :class="['grid size-8 shrink-0 place-items-center rounded-full', log.amount > 0 ? 'bg-emerald-500/12 text-emerald-300' : 'bg-amber-500/12 text-amber-300']">
                <Plus v-if="log.amount > 0" class="size-3.5" />
                <Minus v-else class="size-3.5" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-white">{{ log.remark }}</p>
                <p class="text-xs text-white/35">{{ log.createdAt }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="['text-sm font-semibold', log.amount > 0 ? 'text-emerald-300' : 'text-amber-300']">{{ log.amount > 0 ? `+${log.amount}` : log.amount }}</p>
              <p class="text-xs text-white/35">{{ t('余额', 'Balance') }} {{ log.balance }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== API 设置 ========== -->
      <section v-if="activeTab === 'api'" class="space-y-4">
        <div>
          <h1 class="text-xl font-semibold text-white">{{ t('API 管理', 'API Management') }}</h1>
          <p class="mt-0.5 text-sm text-white/45">{{ t('管理 AI 服务供应商的 API 配置', 'Manage AI provider API configurations') }}</p>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <div class="mb-5 flex gap-1 rounded-lg bg-black/20 p-1">
            <button
              v-for="apiTab in apiTabs"
              :key="apiTab.key"
              class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"
              :class="activeApiTab === apiTab.key ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/55 hover:text-white/80'"
              @click="activeApiTab = apiTab.key"
            >
              {{ apiTab.label }}
            </button>
          </div>

          <!-- Chat API -->
          <div v-if="activeApiTab === 'chat'" class="space-y-3">
            <FieldInput v-model="chatForm.baseUrl" :label="t('Base URL', 'Base URL')" placeholder="https://api.deepseek.com" />
            <FieldInput v-model="chatForm.model" :label="t('默认模型', 'Default Model')" placeholder="deepseek-chat" />
            <FieldInput v-model="chatForm.apiKey" label="API Key" :type="showChatKey ? 'text' : 'password'" placeholder="sk-...">
              <button class="text-white/38 hover:text-white/72" @click="showChatKey = !showChatKey">
                <component :is="showChatKey ? EyeOff : Eye" class="size-3.5" />
              </button>
            </FieldInput>
            <div class="flex items-center gap-3 pt-2">
              <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="handleSaveChat">
                <Save class="mr-1.5 inline-block size-3.5" />{{ t('保存', 'Save') }}
              </button>
              <span v-if="apiStatusMsg" class="text-xs" :class="apiStatusError ? 'text-red-400' : 'text-emerald-300'">{{ apiStatusMsg }}</span>
            </div>
          </div>

          <!-- Image API -->
          <div v-if="activeApiTab === 'image'" class="space-y-3">
            <div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">
              <p class="text-[11px] text-cyan-200/70">{{ t('用于图像卡片和图像生成节点', 'Used by Image cards and image generation nodes') }}</p>
            </div>
            <div>
              <label class="mb-1 block text-xs text-white/55">{{ t('供应商', 'Provider') }}</label>
              <select v-model="imageForm.provider" class="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50">
                <option value="openai">OpenAI compatible</option>
                <option value="ark">Volcengine ARK</option>
                <option value="custom">{{ t('自定义', 'Custom compatible') }}</option>
              </select>
            </div>
            <FieldInput v-model="imageForm.baseUrl" :label="t('Base URL', 'Base URL')" :placeholder="imageUrlPlaceholder" />
            <FieldInput v-model="imageForm.model" :label="t('默认模型', 'Default Model')" placeholder="dall-e-3 / jimeng-5.0" />
            <FieldInput v-model="imageForm.apiKey" label="Access Key / API Key" :type="showImageKey ? 'text' : 'password'" placeholder="sk-... / AKTP...">
              <button class="text-white/38 hover:text-white/72" @click="showImageKey = !showImageKey">
                <component :is="showImageKey ? EyeOff : Eye" class="size-3.5" />
              </button>
            </FieldInput>
            <div class="flex items-center gap-3 pt-2">
              <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="handleSaveImage">
                <Save class="mr-1.5 inline-block size-3.5" />{{ t('保存', 'Save') }}
              </button>
              <button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10" @click="handleTestApi('image')">
                <RefreshCw class="mr-1.5 inline-block size-3.5" />{{ t('测试', 'Test') }}
              </button>
              <span v-if="apiStatusMsg" class="text-xs" :class="apiStatusError ? 'text-red-400' : 'text-emerald-300'">{{ apiStatusMsg }}</span>
            </div>
          </div>

          <!-- Video API -->
          <div v-if="activeApiTab === 'video'" class="space-y-3">
            <div class="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">
              <p class="text-[11px] text-cyan-200/70">{{ t('用于视频卡片和视频生成节点', 'Used by Video cards and video generation nodes') }}</p>
            </div>
            <FieldInput v-model="videoForm.baseUrl" :label="t('Base URL', 'Base URL')" placeholder="https://ark.cn-beijing.volces.com/api/v3" />
            <FieldInput v-model="videoForm.model" :label="t('默认模型', 'Default Model')" placeholder="doubao-seedance-2.0" />
            <FieldInput v-model="videoForm.apiKey" label="API Key" :type="showVideoKey ? 'text' : 'password'" placeholder="sk-...">
              <button class="text-white/38 hover:text-white/72" @click="showVideoKey = !showVideoKey">
                <component :is="showVideoKey ? EyeOff : Eye" class="size-3.5" />
              </button>
            </FieldInput>
            <div class="flex items-center gap-3 pt-2">
              <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="handleSaveVideo">
                <Save class="mr-1.5 inline-block size-3.5" />{{ t('保存', 'Save') }}
              </button>
              <button class="h-9 rounded-lg border border-white/10 bg-white/6 px-4 text-xs text-white/72 transition hover:bg-white/10" @click="handleTestApi('video')">
                <RefreshCw class="mr-1.5 inline-block size-3.5" />{{ t('测试', 'Test') }}
              </button>
              <span v-if="apiStatusMsg" class="text-xs" :class="apiStatusError ? 'text-red-400' : 'text-emerald-300'">{{ apiStatusMsg }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 账号设置 ========== -->
      <section v-if="activeTab === 'account'" class="space-y-4">
        <div>
          <h1 class="text-xl font-semibold text-white">{{ t('账号设置', 'Account Settings') }}</h1>
          <p class="mt-0.5 text-sm text-white/45">{{ t('管理个人资料、偏好和安全设置', 'Manage profile, preferences and security') }}</p>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <div class="mb-4 flex gap-1 rounded-lg bg-black/20 p-1">
            <button
              v-for="st in subTabs"
              :key="st.key"
              class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition"
              :class="activeSubTab === st.key ? 'bg-cyan-500/12 text-cyan-100 ring-1 ring-cyan-400/30' : 'text-white/55 hover:text-white/80'"
              @click="activeSubTab = st.key"
            >
              {{ st.label }}
            </button>
          </div>

          <!-- Profile -->
          <div v-if="activeSubTab === 'profile'" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="relative cursor-pointer group" @click="avatarInput?.click()">
                <div v-if="authStore.user?.avatar" class="size-14 overflow-hidden rounded-full">
                  <img :src="authStore.user.avatar" class="size-full object-cover" />
                </div>
                <div v-else class="grid size-14 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">{{ profileInitial }}</div>
                <div class="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                  <Camera class="size-5" />
                </div>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
              </div>
              <div>
                <h2 class="text-sm font-semibold text-white">{{ userName }}</h2>
                <p class="text-xs text-white/42">{{ userEmail || t('未设置邮箱', 'No email') }}</p>
              </div>
              <span v-if="avatarMsg" class="text-xs" :class="avatarMsgError ? 'text-red-400' : 'text-emerald-300'">{{ avatarMsg }}</span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('用户名', 'Username') }}</span>
                <input v-model="profileForm.username" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              </label>
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('昵称', 'Nickname') }}</span>
                <input v-model="profileForm.nickname" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              </label>
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('邮箱', 'Email') }}</span>
                <input v-model="profileForm.email" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              </label>
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('手机', 'Phone') }}</span>
                <input v-model="profileForm.phone" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              </label>
            </div>
            <div class="flex items-center gap-3">
              <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" @click="saveProfile">{{ t('保存资料', 'Save Profile') }}</button>
              <span class="text-xs text-emerald-300/80">{{ profileSavedMsg }}</span>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="activeSubTab === 'preferences'" class="space-y-4">
            <h2 class="text-sm font-semibold text-white">{{ t('偏好设置', 'Preferences') }}</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('界面语言', 'Language') }}</span>
                <select v-model="languageProxy" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label class="block">
                <span class="mb-1 block text-xs text-white/48">{{ t('主题', 'Theme') }}</span>
                <select v-model="themeProxy" class="h-10 w-full rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60">
                  <option value="dark">{{ t('深色', 'Dark') }}</option>
                  <option value="light">{{ t('浅色', 'Light') }}</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Security -->
          <div v-if="activeSubTab === 'security'" class="space-y-4">
            <h2 class="text-sm font-semibold text-white">{{ t('安全', 'Security') }}</h2>
            <div class="grid gap-4 md:grid-cols-3">
              <input v-model="passwordForm.old" type="password" :placeholder="t('当前密码', 'Current password')" class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              <input v-model="passwordForm.next" type="password" :placeholder="t('新密码', 'New password')" class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
              <input v-model="passwordForm.confirm" type="password" :placeholder="t('确认新密码', 'Confirm password')" class="h-10 rounded-lg border border-white/8 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-400/60" />
            </div>
            <div class="flex items-center gap-3">
              <button class="h-9 rounded-lg bg-cyan-100 px-4 text-xs font-medium text-[#061018] transition hover:bg-white" :disabled="passwordSaving" @click="handlePasswordChange">
                <span v-if="passwordSaving" class="inline-block mr-1.5 size-3 animate-spin rounded-full border-2 border-[#061018] border-t-transparent" />
                {{ t('修改密码', 'Change Password') }}
              </button>
              <span v-if="passwordMsg" class="text-xs" :class="passwordMsgError ? 'text-red-400' : 'text-emerald-300'">{{ passwordMsg }}</span>
            </div>
          </div>

          <div class="mt-6 border-t border-white/10 pt-5">
            <button class="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/20 hover:text-red-200" @click="handleLogout">
              <LogOut class="size-4" />
              {{ t('退出账号', 'Logout') }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft, Camera, Coins, Crown, ExternalLink, Eye, EyeOff, GitBranch, Image, Key, Layout, LogOut, Minus, Pencil, Plus, RefreshCw, Save, Search, Settings, Stars, Trash2, UserRound, Video
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { projectService } from '~/services/projectService'
import { authService } from '~/services/authService'
import { aiService, loadProviderConfigsFromBackend, providerKeyFor, readApiConfig, saveApiConfig } from '~/services/aiService'
import { defineComponent, h } from 'vue'

const FieldInput = defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'space-y-1' }, [
      h('label', { class: 'block text-xs text-white/55' }, props.label),
      h('div', { class: slots.default ? 'relative' : '' }, [
        h('input', {
          value: props.modelValue,
          type: props.type,
          placeholder: props.placeholder,
          class: `h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white/80 outline-none focus:border-cyan-300/50 ${slots.default ? 'pr-9' : ''}`,
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
        }),
        slots.default ? h('div', { class: 'absolute right-2 top-1/2 -translate-y-1/2' }, slots.default()) : null
      ])
    ])
  }
})

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const t = (zh: string, en: string) => settingsStore.t(zh, en)

// ========== Sidebar tabs ==========
const activeTab = ref<'projects' | 'credits' | 'api' | 'account'>('projects')

const tabs = computed(() => [
  { id: 'projects', label: t('画布管理', 'Canvases'), icon: Layout },
  { id: 'credits', label: t('积分管理', 'Credits'), icon: Crown },
  { id: 'api', label: t('API 管理', 'API'), icon: Key },
  { id: 'account', label: t('账号设置', 'Account'), icon: UserRound },
])

const profileInitial = computed(() => (authStore.user?.nickname || authStore.user?.username || 'P').charAt(0).toUpperCase())
const userName = computed(() => authStore.user?.nickname || authStore.user?.username || 'Polaris')
const userEmail = computed(() => authStore.user?.email || '')

// ========== Sub tabs for account settings ==========
const activeSubTab = ref<'profile' | 'preferences' | 'security'>('profile')
const subTabs = computed(() => [
  { key: 'profile', label: t('个人资料', 'Profile') },
  { key: 'preferences', label: t('偏好', 'Preferences') },
  { key: 'security', label: t('安全', 'Security') },
])

// ========== Language / Theme proxy ==========
const languageProxy = computed({
  get: () => settingsStore.language,
  set: (value: 'zh' | 'en') => settingsStore.setLanguage(value),
})
const themeProxy = computed({
  get: () => settingsStore.theme,
  set: (value: 'dark' | 'light') => {
    if (settingsStore.theme !== value) settingsStore.toggleTheme()
    if (import.meta.client) document.documentElement.classList.toggle('light', value === 'light')
  },
})

// ========== Profile form ==========
const profileForm = reactive({ username: '', nickname: '', email: '', phone: '' })
const profileSavedMsg = ref('')
const avatarInput = ref<HTMLInputElement>()
const avatarMsg = ref('')
const avatarMsgError = ref(false)

async function handleAvatarUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  avatarMsg.value = ''
  avatarMsgError.value = false
  const userId = authStore.user?.id
  if (!userId) { avatarMsg.value = t('用户信息缺失', 'User info missing'); avatarMsgError.value = true; return }
  try {
    const res: any = await authService.uploadAvatar(Number(userId), file)
    const url = res?.data || res?.url || ''
    if (url) {
      authStore.user = { ...(authStore.user || {}), avatar: url }
      if (import.meta.client) localStorage.setItem('polaris.user', JSON.stringify(authStore.user))
      avatarMsg.value = t('头像已更新', 'Avatar updated')
    } else {
      avatarMsg.value = t('上传失败', 'Upload failed')
      avatarMsgError.value = true
    }
  } catch (err: any) {
    avatarMsg.value = err?.response?.data?.message || err?.message || t('上传失败', 'Upload failed')
    avatarMsgError.value = true
  }
  target.value = ''
}

function initProfileForm() {
  Object.assign(profileForm, {
    username: authStore.user?.username || '',
    nickname: authStore.user?.nickname || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
  })
}

function saveProfile() {
  authStore.user = { ...(authStore.user || {}), ...profileForm }
  if (import.meta.client) localStorage.setItem('polaris.user', JSON.stringify(authStore.user))
  profileSavedMsg.value = t('已保存', 'Saved')
  setTimeout(() => { profileSavedMsg.value = '' }, 1800)
}

// ========== Password form ==========
const passwordForm = reactive({ old: '', next: '', confirm: '' })
const passwordSaving = ref(false)
const passwordMsg = ref('')
const passwordMsgError = ref(false)

async function handlePasswordChange() {
  passwordMsg.value = ''
  passwordMsgError.value = false
  const { old: oldPassword, next: newPassword, confirm } = passwordForm
  if (!oldPassword) { passwordMsg.value = t('请输入当前密码', 'Enter current password'); passwordMsgError.value = true; return }
  if (!newPassword) { passwordMsg.value = t('请输入新密码', 'Enter new password'); passwordMsgError.value = true; return }
  if (newPassword.length < 6) { passwordMsg.value = t('新密码至少6位', 'Password must be 6+ characters'); passwordMsgError.value = true; return }
  if (newPassword !== confirm) { passwordMsg.value = t('两次密码不一致', 'Passwords do not match'); passwordMsgError.value = true; return }
  const userId = authStore.user?.id
  if (!userId) { passwordMsg.value = t('用户信息缺失', 'User info missing'); passwordMsgError.value = true; return }
  passwordSaving.value = true
  try {
    const res: any = await authService.updatePassword(Number(userId), { oldPassword, newPassword })
    if (res?.code && res.code !== 200) {
      passwordMsg.value = res.message || t('修改失败', 'Failed')
      passwordMsgError.value = true
    } else {
      passwordMsg.value = t('密码修改成功', 'Password updated')
      passwordMsgError.value = false
      passwordForm.old = ''
      passwordForm.next = ''
      passwordForm.confirm = ''
    }
  } catch (err: any) {
    const body = err?.response?.data || err?.data || {}
    passwordMsg.value = body.message || body.msg || err?.message || t('修改失败', 'Failed')
    passwordMsgError.value = true
  }
  passwordSaving.value = false
}

function handleLogout() {
  authStore.logout()
}

// ========== Projects (saved canvases) ==========
const projectQuery = ref('')
const projects = ref<any[]>([])
const projectObjectCounts = ref<Record<string | number, number>>({})
const projectRunningTasks = ref<Record<string | number, boolean>>({})
const renaming = ref<any>(null)
const renameValue = ref('')
const deleting = ref<any>(null)

const filteredProjects = computed(() => {
  const q = projectQuery.value.trim().toLowerCase()
  return projects.value.filter((p) => {
    const text = `${p.name || ''} ${p.title || ''} ${p.description || ''}`.toLowerCase()
    return !q || text.includes(q)
  })
})

function modeLabel(mode?: string) {
  const value = (mode || 'magic').toLowerCase()
  if (value.includes('workflow')) return t('工作流', 'Workflow')
  if (value.includes('image')) return t('图片', 'Image')
  if (value.includes('video')) return t('视频', 'Video')
  return t('星图', 'Star')
}

function modeIcon(mode?: string) {
  const value = (mode || 'magic').toLowerCase()
  if (value.includes('workflow')) return 'GitBranch'
  if (value.includes('image')) return 'Image'
  if (value.includes('video')) return 'Video'
  return 'Stars'
}

function previewBg(mode?: string) {
  const value = (mode || 'magic').toLowerCase()
  if (value.includes('workflow')) return 'bg-gradient-to-br from-violet-500/30 via-violet-500/10 to-transparent'
  if (value.includes('image')) return 'bg-gradient-to-br from-emerald-500/30 via-emerald-500/10 to-transparent'
  if (value.includes('video')) return 'bg-gradient-to-br from-rose-500/30 via-rose-500/10 to-transparent'
  return 'bg-gradient-to-br from-cyan-500/30 via-blue-500/10 to-transparent'
}

const tick = ref(0)
let tickTimer: ReturnType<typeof setInterval> | null = null

function timeAgo(dateStr: string | number | Date) {
  void tick.value
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('刚刚', 'just now')
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`
  return `${Math.floor(months / 12)}y`
}

function openProject(id: string | number) {
  navigateTo(`/projects/${id}`)
}

function startRename(project: any) {
  renaming.value = project
  renameValue.value = project.name || project.title || ''
}

async function doRename() {
  if (!renaming.value || !renameValue.value.trim()) return
  try {
    await projectService.update(renaming.value.id, { name: renameValue.value.trim() })
    renaming.value.name = renameValue.value.trim()
  } catch {}
  renaming.value = null
}

function confirmDelete(project: any) {
  deleting.value = project
}

async function doDelete() {
  if (!deleting.value) return
  try {
    await projectService.delete(deleting.value.id)
    projects.value = projects.value.filter((p) => p.id !== deleting.value.id)
    delete projectObjectCounts.value[deleting.value.id]
  } catch {}
  deleting.value = null
}

async function loadProjects() {
  try {
    const res: any = await projectService.list({})
    projects.value = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res?.records || []
    // Fetch object counts and check for running tasks in parallel
    const counts: Record<string | number, number> = {}
    const running: Record<string | number, boolean> = {}
    await Promise.all(projects.value.map(async (p) => {
      try {
        const objects = await projectService.getObjects(p.id)
        const list = Array.isArray(objects) ? objects : []
        counts[p.id] = list.length
        // Check if any object has a running task
        for (const obj of list) {
          if (obj.meta) {
            try {
              const parsed = JSON.parse(obj.meta)
              if (parsed.taskStatus === 'running' && !parsed.generatedUrl) {
                running[p.id] = true
                break
              }
            } catch {}
          }
        }
      } catch { counts[p.id] = 0 }
    }))
    projectObjectCounts.value = counts
    projectRunningTasks.value = running
  } catch {
    projects.value = []
  }
}

// ========== Credits ==========
interface CreditLog {
  id: string; amount: number; balance: number; remark: string; createdAt: string
}
const creditLogs = ref<CreditLog[]>([])

const costs = computed(() => [
  { name: t('图片生成', 'Image generation'), cost: '40' },
  { name: t('分镜生成', 'Storyboard generation'), cost: '80' },
  { name: t('视频生成', 'Video generation'), cost: '120' },
  { name: t('工作流运行', 'Workflow run'), cost: '160' },
])

function loadCreditLogs() {
  if (!import.meta.client) return
  try { creditLogs.value = JSON.parse(localStorage.getItem('polaris.creditLogs') || '[]') } catch { creditLogs.value = [] }
}

function persistCreditLogs() {
  if (import.meta.client) localStorage.setItem('polaris.creditLogs', JSON.stringify(creditLogs.value.slice(0, 30)))
}

function pushLog(amount: number, remark: string) {
  creditLogs.value.unshift({ id: crypto.randomUUID(), amount, balance: authStore.credits, remark, createdAt: new Date().toLocaleString() })
  persistCreditLogs()
}

function addDemoCredits(amount: number) {
  authStore.addCredits(amount)
  pushLog(amount, t('测试积分入账', 'Demo credit grant'))
}

function spendDemoCredits(amount: number) {
  authStore.spendCredits(amount)
  pushLog(-amount, amount === 40 ? t('图片生成扣费', 'Image generation charge') : t('视频生成扣费', 'Video generation charge'))
}

function clearLogs() {
  creditLogs.value = []
  persistCreditLogs()
}

// ========== API Settings ==========
const activeApiTab = ref<'chat' | 'image' | 'video'>('chat')
const showChatKey = ref(false)
const showImageKey = ref(false)
const showVideoKey = ref(false)
const apiStatusMsg = ref('')
const apiStatusError = ref(false)
const chatForm = reactive({ baseUrl: '', apiKey: '', model: '' })
const imageForm = reactive({ provider: 'openai', baseUrl: '', apiKey: '', secretKey: '', model: '' })
const videoForm = reactive({ baseUrl: '', apiKey: '', model: '' })

const apiTabs = computed(() => [
  { key: 'chat', label: t('Chat / 润色', 'Chat / Enhance') },
  { key: 'image', label: t('图像 API', 'Image API') },
  { key: 'video', label: t('视频 API', 'Video API') },
])

const imageUrlPlaceholder = computed(() => {
  if (imageForm.provider === 'ark') return 'https://ark.cn-beijing.volces.com/api/v3'
  if (imageForm.provider === 'openai') return 'https://api.openai.com'
  return 'https://your-api.example.com'
})

function loadApiLocal() {
  Object.assign(chatForm, { baseUrl: '', apiKey: '', model: '', ...readApiConfig('chat') })
  Object.assign(imageForm, { provider: 'openai', baseUrl: '', apiKey: '', secretKey: '', model: '', ...readApiConfig('image') })
  Object.assign(videoForm, { baseUrl: '', apiKey: '', model: '', ...readApiConfig('video') })
}

async function loadApiBackend() {
  try {
    const list = await loadProviderConfigsFromBackend()
    for (const item of list) {
      if (item.provider === 'chat') {
        Object.assign(chatForm, { baseUrl: item.baseUrl || chatForm.baseUrl, apiKey: item.apiKey || chatForm.apiKey, model: item.model || chatForm.model })
      } else if (item.provider === 'image-openai' || item.provider === 'image-custom' || item.provider === 'image-volcengine-jimeng') {
        Object.assign(imageForm, { provider: item.provider.replace(/^image-/, '') || 'openai', baseUrl: item.baseUrl || imageForm.baseUrl, apiKey: item.apiKey || imageForm.apiKey, secretKey: item.secretKey || imageForm.secretKey, model: item.model || imageForm.model })
      } else if (item.provider === 'jimeng' || item.provider === 'jimeng-4') {
        Object.assign(imageForm, { provider: 'ark', baseUrl: item.baseUrl || imageForm.baseUrl, apiKey: item.apiKey || imageForm.apiKey, secretKey: item.secretKey || imageForm.secretKey, model: item.model || imageForm.model })
      } else if (item.provider === 'video-default' || item.provider?.startsWith('video-')) {
        Object.assign(videoForm, { baseUrl: item.baseUrl || videoForm.baseUrl, apiKey: item.apiKey || videoForm.apiKey, model: item.model || videoForm.model })
      }
    }
  } catch {}
}

function handleSaveChat() {
  saveApiConfig('chat', { provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
  aiService.saveProviders({ provider: 'chat', baseUrl: chatForm.baseUrl, apiKey: chatForm.apiKey, model: chatForm.model })
    .then(() => { apiStatusMsg.value = t('已保存', 'Saved.'); apiStatusError.value = false })
    .catch(() => { apiStatusMsg.value = t('本地已保存，服务端保存失败', 'Saved locally, server save failed'); apiStatusError.value = true })
}

function handleSaveImage() {
  saveApiConfig('image', { provider: imageForm.provider, baseUrl: imageForm.baseUrl, apiKey: imageForm.apiKey, secretKey: imageForm.secretKey, model: imageForm.model })
  const dbProvider = imageForm.provider === 'ark' ? 'jimeng' : providerKeyFor('image', imageForm.provider)
  aiService.saveProviders({ provider: dbProvider, baseUrl: imageForm.baseUrl, apiKey: imageForm.apiKey, secretKey: imageForm.secretKey, model: imageForm.model })
    .then(() => { apiStatusMsg.value = t('已保存', 'Saved.'); apiStatusError.value = false })
    .catch(() => { apiStatusMsg.value = t('本地已保存，服务端保存失败', 'Saved locally, server save failed'); apiStatusError.value = true })
}

function handleSaveVideo() {
  saveApiConfig('video', { provider: videoForm.provider, baseUrl: videoForm.baseUrl, apiKey: videoForm.apiKey, model: videoForm.model })
  aiService.saveProviders({ provider: providerKeyFor('video', videoForm.provider), baseUrl: videoForm.baseUrl, apiKey: videoForm.apiKey, model: videoForm.model })
    .then(() => { apiStatusMsg.value = t('已保存', 'Saved.'); apiStatusError.value = false })
    .catch(() => { apiStatusMsg.value = t('本地已保存，服务端保存失败', 'Saved locally, server save failed'); apiStatusError.value = true })
}

async function handleTestApi(type: 'image' | 'video') {
  const form = type === 'image' ? imageForm : videoForm
  if (!form.apiKey) {
    apiStatusMsg.value = t('请输入 API Key', 'Please enter API Key')
    apiStatusError.value = true
    return
  }
  try {
    const res: any = type === 'image'
      ? await aiService.imageGenerate({ baseUrl: imageForm.baseUrl || undefined, apiKey: imageForm.apiKey, secretKey: undefined, provider: imageForm.provider, model: imageForm.model || 'dall-e-3', prompt: 'test', size: '1024x1024' })
      : await aiService.videoGenerate({ baseUrl: videoForm.baseUrl || undefined, apiKey: videoForm.apiKey, model: videoForm.model || 'seedance-2.0', prompt: 'test' })
    if (res?.error) {
      apiStatusMsg.value = res.error; apiStatusError.value = true
    } else {
      apiStatusMsg.value = res?.url || res?.taskId ? t('连接成功', 'Connected.') : t('连接成功，无返回 URL', 'Connected, no URL'); apiStatusError.value = false
    }
  } catch (err: any) {
    apiStatusMsg.value = err?.message || t('连接失败', 'Connection failed'); apiStatusError.value = true
  }
}

// ========== Init ==========
onMounted(() => {
  settingsStore.init()
  authStore.init()
  initProfileForm()
  loadProjects()
  loadCreditLogs()
  loadApiLocal()
  loadApiBackend()
  tickTimer = setInterval(() => { tick.value++ }, 30000)
})

onUnmounted(() => {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null }
})
</script>
