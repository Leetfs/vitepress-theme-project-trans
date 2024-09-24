<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

// 获取页面数据
const { frontmatter, attrs } = useData()

// 响应式变量
const enableCopyright = ref(frontmatter.value.copyright?.enable ?? false)
const originUrl = ref(frontmatter.value.copyright?.url ?? '')
const license = ref(frontmatter.value.copyright?.license ?? '')
const licenseUrl = ref(frontmatter.value.copyright?.licenseUrl ?? '')
const authors = ref(attrs?.author ?? [])

// 监听 frontmatter 的变化
watch(() => frontmatter.value, (newFrontmatter) => {
  enableCopyright.value = newFrontmatter.copyright?.enable ?? false
  originUrl.value = newFrontmatter.copyright?.url ?? ''
  license.value = newFrontmatter.copyright?.license ?? ''
  licenseUrl.value = newFrontmatter.copyright?.licenseUrl ?? ''
  authors.value = attrs?.author ?? []
})

</script>

<template>
  <div v-if="enableCopyright && authors.length > 0">
    <div class="tip custom-block">
      <p class="custom-block-title">Copyright</p>
      <p>
        <span>这篇文章 </span>
        <a v-if="originUrl" :href="originUrl">{{ frontmatter.title }}</a>
        <span v-else>{{ frontmatter.title }}</span>
        <span> 由 </span>
        <span v-for="(author, index) in authors" :key="author">
          {{ author }}<span v-if="index !== authors.length - 1">、</span>
        </span>
        <span> 创作</span>
        <span v-if="license">
          <span>，Project Trans 在 </span>
          <a v-if="licenseUrl" :href="licenseUrl">{{ license }}</a>
          <span v-else>{{ license }}</span>
          <span> 许可下使用</span>
        </span>
        <span>。</span>
      </p>
    </div>
    <hr>
  </div>
</template>
