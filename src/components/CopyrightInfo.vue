<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

// 获取页面数据
const { frontmatter, attrs } = useData()

// 响应式变量
const enableCopyright = ref(attrs?.copyright?.enable ?? false)
const originUrlExists = ref(Boolean(frontmatter.originUrl))
const licenseExists = ref(Boolean(frontmatter.license))
const licenseUrlExists = ref(Boolean(frontmatter.licenseUrl))

// 监听 frontmatter 的变化
watch(() => frontmatter.value, (newFrontmatter) => {
  enableCopyright.value = attrs?.copyright?.enable ?? false
})

</script>

<template>
  <div v-if="enableCopyright">
    <div class="tip custom-block">
      <p class="custom-block-title">Copyright</p>
      <p>
        <span>这篇文章 </span>
        <a v-if="originUrlExists" :href="frontmatter.originUrl">{{ frontmatter.title }}</a>
        <span v-else>{{ frontmatter.title }}</span>
        <span> 由 </span>
        <span v-for="author in attrs?.author" :key="author">{{ author }}</span>
        <span> 创作</span>
        <span v-if="licenseExists">
          <span>，Project Trans 在 </span>
          <a v-if="licenseUrlExists" :href="frontmatter.licenseUrl">{{ frontmatter.license }}</a>
          <span v-else>{{ frontmatter.license }}</span>
          <span> 许可下使用</span>
        </span>
        <span>。</span>
      </p>
    </div>
    <hr>
  </div>
</template>
