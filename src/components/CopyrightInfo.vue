<script setup lang="ts">
import { ref, watch } from 'vue'
import { useData } from 'vitepress'
import type { Node, Trie } from '../plugins/CopyrightLoader.data'
import { data } from '../plugins/CopyrightLoader.data'

// 搜索函数
function searchClosestInTrie(
  that: Trie<Record<string, any>>,
  path: string[],
  node: Node<Record<string, any>> = that.root,
): Record<string, any> | null {
  if (path.length === 0)
    return node.value

  if (path[0] in node.children) {
    let value = searchClosestInTrie(
      that,
      path.slice(1),
      node.children[path[0]],
    )
    if (value === null)
      value = node.value

    return value
  }
  return node.value
}

// 创建响应式变量
const attrs = ref<Record<string, any> | null>(null)
const originUrl = ref('javascript:void(0)')
const licenseUrl = ref('javascript:void(0)')
const frontmatter = ref(useData().frontmatter.value)

// 监听路径变化并更新相关变量
watch(
  () => useData().page.value.relativePath,
  (newPath) => {
    const paths = newPath.replace('.md', '').split('/').filter((item: string) => item !== '')
    attrs.value = searchClosestInTrie(data, paths)
    
    if (attrs.value) {
      originUrl.value = attrs.value.copyright?.url ?? 'javascript:void(0)'
      licenseUrl.value = attrs.value.copyright?.licenseUrl ?? 'javascript:void(0)'
    }
  },
  { immediate: true }  // 初次加载时立即执行一次
)

// 监听 frontmatter 的变化
watch(
  () => useData().frontmatter.value,
  (newFrontmatter) => {
    frontmatter.value = newFrontmatter
  },
  { immediate: true }  // 初次加载时立即执行一次
)

// 计算是否存在相关信息
const originUrlExists = () => (attrs.value?.copyright?.url ?? null) != null
const licenseExists = () => attrs.value?.copyright?.license != null
const licenseUrlExists = () => (attrs.value?.copyright?.licenseUrl ?? null) != null
</script>

<template>
  <div v-if="attrs?.copyright?.enable ?? false">
    <div class="tip custom-block">
      <p class="custom-block-title">Copyright</p>
      <p>
        <span>这篇文章 </span>
        <a v-if="originUrlExists()" :href="originUrl">{{ frontmatter.title }}</a>
        <span v-else>{{ frontmatter.title }}</span>
        <span> 由 </span>
        <span v-for="author in attrs?.author" :key="author">{{ author }}</span>
        <span> 创作</span>
        <span v-if="licenseExists()">
          <span>，Project Trans 在 </span>
          <a v-if="licenseUrlExists()" :href="licenseUrl">{{ attrs.value?.copyright?.license }}</a>
          <span v-else>{{ attrs.value?.copyright?.license }}</span>
          <span> 许可下使用</span>
        </span>
        <span>。</span>
      </p>
    </div>
    <hr>
  </div>
</template>
