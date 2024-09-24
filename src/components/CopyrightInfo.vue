<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useData } from 'vitepress'
import type { Node, Trie } from '../plugins/CopyrightLoader.data'
import { data } from '../plugins/CopyrightLoader.data'

// 搜索函数
function searchClosestInTrie(
  that: Trie<Record<string, any>>,
  path: string[],
  node: Node<Record<string, any>> = that.root,
): Record<string, any> | null {
  if (path.length === 0) return node.value

  if (path[0] in node.children) {
    const value = searchClosestInTrie(
      that,
      path.slice(1),
      node.children[path[0]],
    )
    return value === null ? node.value : value
  }
  return node.value
}

// 获取页面数据
const { frontmatter } = useData()

// 创建响应式变量
const attrs = ref<Record<string, any> | null>(null)

// 计算路径并更新 attrs
function updateAttrs() {
  const paths = useData()
    .page.value.relativePath
    .replace('.md', '')
    .split('/')
    .filter((item: string) => item !== '')
  
  attrs.value = searchClosestInTrie(data, paths)
}

// 监听页面数据变化
watch(
  () => useData().page.value.relativePath,
  updateAttrs,
  { immediate: true } // 初始化时也执行一次
)

// 计算属性
const originUrl = computed(() => attrs.value?.copyright?.url ?? 'javascript:void(0)')
const licenseUrl = computed(() => attrs.value?.copyright?.licenseUrl ?? 'javascript:void(0)')
const license = computed(() => attrs.value?.copyright?.license ?? null)

const originUrlExists = computed(() => originUrl.value !== 'javascript:void(0)')
const licenseExists = computed(() => license.value != null)
const licenseUrlExists = computed(() => licenseUrl.value !== 'javascript:void(0)')
</script>

<template>
  <div v-if="attrs?.copyright?.enable ?? false">
    <div class="tip custom-block">
      <p class="custom-block-title">Copyright</p>
      <p>
        <span>这篇文章 </span>
        <a v-if="originUrlExists" :href="originUrl">{{ frontmatter.title }}</a>
        <span v-else>{{ frontmatter.title }}</span>
        <span> 由 </span>
        <span v-for="author in attrs?.author" :key="author">{{ author }}</span>
        <span> 创作</span>
        <span v-if="licenseExists">
          <span>，Project Trans 在 </span>
          <a v-if="licenseUrlExists" :href="licenseUrl">{{ license }}</a>
          <span v-else>{{ license }}</span>
          <span> 许可下使用</span>
        </span>
        <span>。</span>
      </p>
    </div>
    <hr>
  </div>
</template>

<style scoped>
/* 这里可以添加样式 */
</style>
