import models from '../models'

const Demo = models.Demo
const demo = {}

// TODO 给传参消毒

demo.list = (req, res, next) => {
  const userId = req.user.userId
  let countPerPage = 10, currentPage = req.query.page || 1
  if (!(/^[0-9]*$/).test(currentPage)) {
    currentPage = 1
  }
  currentPage = Number(currentPage)
  Demo.findAndCountAll({
    limit: countPerPage,
    offset: countPerPage * (currentPage - 1),
    where: {UserId: userId}
  }).then((result) => {
    const data = {
      msg: '获取所有demo成功！',
      success: true,
      demos: result.rows,
      page: {
        total: result.count,
        current: currentPage
      }
    }
    res.json(data)
  }).catch((err) => {
    next(err)
  })
}

demo.get = (req, res, next) => {
  const userId = req.user.userId
  const { id } = req.params
  Demo.findOne({where: {id,UserId: userId}}).then((demo) => {
    res.json({
      msg: '查询demo成功！',
      success: true,
      data: demo
    })
  }).catch((err) => {
    next(err)
  })
}

demo.create = (req, res, next) => {
  const userId = req.user.userId
  let {template, content} = req.body
  Demo.create({template,content, UserId: userId}).then((demo) => {
    const data = {
      msg: '新建demo成功！',
      success: true,
    demo}
    res.json(data)
  }).catch((err) => {
    next(err)
  })
}

demo.update = (req, res) => {
  const userId = req.user.userId
  const { id } = req.params
  const { template, content } = req.body
  Demo.update({template,content}, {where: {id,UserId: userId}}).then(() => {
    const data = {
      msg: '修改demo成功！',
      success: true
    }
    res.json(data)
  })
}

demo.remove = (req, res, next) => {
  const userId = req.user.userId
  const { id } = req.params
  Demo.destroy({where: {id,UserId: userId}}).then(() => {
    res.json({
      msg: '删除demo成功！',
      success: true
    })
  }).catch((err) => {
    next(err)
  })
}

demo.preview = (req, res, next) => {
  const { id } = req.params
  Demo.findOne({where: {id}}).then((demo) => {
    res.render(demo.template, JSON.parse(demo.content))
  }).catch((err) => {
    next(err)
  })
}

export default demo
