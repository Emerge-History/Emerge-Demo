import models from '../models'

const Demo = models.Demo
const demo = {}

demo.list = (req, res, next) => {
  let countPerPage = 10, currentPage = req.query.page || 1
  if (!(/^[0-9]*$/).test(currentPage)) {
    currentPage = 1
  }
  currentPage = Number(currentPage)
  Demo.findAndCountAll({
    limit: countPerPage,
    offset: countPerPage * (currentPage - 1)
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
  const { id } = req.params
  Demo.findOne({where: {id}}).then((demo) => {
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
  let {img, name, material, year, color, introduce, voice, AuthorId} = req.body
  Demo.create({img, name, material, year, color, introduce, voice, AuthorId}).then((demo) => {
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
  const { id } = req.params
  const { img, name, material, year, color, introduce, voice, AuthorId } = req.body
  Demo.update({img, name, material, year, color, introduce, voice, AuthorId}, {where: {id}}).then(() => {
    const data = {
      msg: '修改demo成功！',
      success: true
    }
    res.json(data)
  })
}

demo.remove = (req, res, next) => {
  const { id } = req.params
  Demo.destroy({where: {id}}).then(() => {
    res.json({
      msg: '删除demo成功！',
      success: true
    })
  }).catch((err) => {
    next(err)
  })
}

export default demo
